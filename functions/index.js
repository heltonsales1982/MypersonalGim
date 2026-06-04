const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// ══════════════════════════════════════════════
// JWT UTILITIES
// ══════════════════════════════════════════════
const jwt = require('jsonwebtoken');
const SECRET_KEY = functions.config().jwt.secret || 'peakos-secret-key-2024';

/**
 * Gera um token JWT para o usuário
 */
exports.generateToken = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
  }

  const email = context.auth.token.email;
  const payload = {
    email: email,
    uid: context.auth.uid,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
  };

  try {
    const token = jwt.sign(payload, SECRET_KEY);
    return { token };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Erro ao gerar token');
  }
});

/**
 * Valida um token JWT
 */
exports.validateToken = functions.https.onCall(async (data, context) => {
  const { token } = data;

  if (!token) {
    throw new functions.https.HttpsError('invalid-argument', 'Token não fornecido');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
});

// ══════════════════════════════════════════════
// USER MANAGEMENT
// ══════════════════════════════════════════════

/**
 * Cria um novo usuário com email e senha
 */
exports.createUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
  }

  const { email, password, nome } = data;

  if (!email || !password || !nome) {
    throw new functions.https.HttpsError('invalid-argument', 'Dados incompletos');
  }

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: nome
    });

    return { success: true, uid: userRecord.uid };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Atualiza o perfil do usuário
 */
exports.updateUserProfile = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
  }

  const { nome, peso, altura, sexo, nascimento } = data;

  try {
    const updates = {};
    if (nome) updates.displayName = nome;

    await admin.auth().updateUser(context.auth.uid, updates);

    // Salvar dados adicionais no Realtime Database
    const db = admin.database();
    await db.ref('gymai_profile/' + context.auth.uid).set({
      nome: nome || '',
      peso: peso || 0,
      altura: altura || 0,
      sexo: sexo || '',
      nascimento: nascimento || '',
      updatedAt: Date.now()
    });

    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ══════════════════════════════════════════════
// FEATURE MANAGEMENT
// ══════════════════════════════════════════════

/**
 * Ativa uma feature para o usuário
 */
exports.activateFeature = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
  }

  const { featureId } = data;

  if (!featureId) {
    throw new functions.https.HttpsError('invalid-argument', 'Feature ID não fornecido');
  }

  try {
    const db = admin.database();
    await db.ref('gymai_features/' + context.auth.uid + '/' + featureId).set(true);
    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Desativa uma feature para o usuário
 */
exports.deactivateFeature = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
  }

  const { featureId } = data;

  if (!featureId) {
    throw new functions.https.HttpsError('invalid-argument', 'Feature ID não fornecido');
  }

  try {
    const db = admin.database();
    await db.ref('gymai_features/' + context.auth.uid + '/' + featureId).remove();
    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ══════════════════════════════════════════════
// DATA AGGREGATION
// ══════════════════════════════════════════════

/**
 * Gera relatório de progresso do usuário
 */
exports.generateReport = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
  }

  const { period, startDate } = data;

  try {
    const db = admin.database();
    const uid = context.auth.uid;

    // Buscar dados de log
    const logSnapshot = await db.ref('gymai_log/' + uid).once('value');
    const logData = logSnapshot.val() || {};

    // Buscar dados de dias de treino
    const diasSnapshot = await db.ref('gymai_dias_treino/' + uid).once('value');
    const diasData = diasSnapshot.val() || {};

    // Buscar medidas
    const medidasSnapshot = await db.ref('gymai_medidas/' + uid).once('value');
    const medidasData = medidasSnapshot.val() || {};

    // Buscar metas
    const metasSnapshot = await db.ref('gymai_metas/' + uid).once('value');
    const metasData = metasSnapshot.val() || {};

    // Calcular estatísticas
    let totalSeries = 0;
    let totalVolume = 0;
    const treinoDays = new Set();

    if (logData) {
      Object.values(logData).forEach(log => {
        if (log.series) {
          log.series.forEach(serie => {
            totalSeries++;
            totalVolume += (serie.peso || 0) * (serie.reps || 0);
          });
        }
        if (log.dia !== undefined) {
          treinoDays.add(log.dia);
        }
      });
    }

    const diasMarcados = diasData ? Object.keys(diasData).length : 0;

    return {
      success: true,
      report: {
        period,
        startDate,
        totalSeries,
        totalVolume,
        treinoDays: Array.from(treinoDays),
        diasMarcados,
        medidas: medidasData,
        metas: metasData,
        generatedAt: Date.now()
      }
    };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
