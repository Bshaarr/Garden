import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: (origin, cb) => {
	if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
	return cb(new Error('Not allowed by CORS'));
}}));

// Firebase Admin init
if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert({
			projectId: process.env.FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
		}),
	});
}
const db = admin.firestore();

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Courses CRUD
app.get('/api/courses', async (req, res) => {
	const snap = await db.collection('courses').orderBy('inserted_at', 'asc').get();
	res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});
app.post('/api/courses', async (req, res) => {
	const data = req.body;
	data.inserted_at = admin.firestore.FieldValue.serverTimestamp();
	const ref = db.collection('courses').doc();
	await ref.set(data);
	res.status(201).json({ id: ref.id, ...data });
});
app.patch('/api/courses/:id', async (req, res) => {
	await db.collection('courses').doc(req.params.id).update(req.body);
	res.json({ id: req.params.id, ...req.body });
});
app.delete('/api/courses/:id', async (req, res) => {
	await db.collection('courses').doc(req.params.id).delete();
	res.status(204).end();
});

// Announcements
app.get('/api/announcements', async (req, res) => {
	const snap = await db.collection('announcements').orderBy('inserted_at', 'asc').get();
	res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});
app.post('/api/announcements', async (req, res) => {
	const data = req.body;
	data.inserted_at = admin.firestore.FieldValue.serverTimestamp();
	const ref = db.collection('announcements').doc();
	await ref.set(data);
	res.status(201).json({ id: ref.id, ...data });
});
app.patch('/api/announcements/:id', async (req, res) => {
	await db.collection('announcements').doc(req.params.id).update(req.body);
	res.json({ id: req.params.id, ...req.body });
});
app.delete('/api/announcements/:id', async (req, res) => {
	await db.collection('announcements').doc(req.params.id).delete();
	res.status(204).end();
});

// Registrations
app.get('/api/registrations', async (req, res) => {
	const snap = await db.collection('registrations').orderBy('registrationDate', 'desc').get();
	res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});
app.post('/api/registrations', async (req, res) => {
	const data = req.body;
	data.registrationDate = admin.firestore.FieldValue.serverTimestamp();
	const ref = db.collection('registrations').doc();
	await ref.set(data);
	res.status(201).json({ id: ref.id, ...data });
});
app.delete('/api/registrations/:id', async (req, res) => {
	await db.collection('registrations').doc(req.params.id).delete();
	res.status(204).end();
});

// Certificate requests
app.get('/api/certificate-requests', async (req, res) => {
	const snap = await db.collection('certificateRequests').orderBy('requestDate', 'desc').get();
	res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});
app.post('/api/certificate-requests', async (req, res) => {
	const data = req.body;
	data.requestDate = admin.firestore.FieldValue.serverTimestamp();
	data.status = 'pending';
	const ref = db.collection('certificateRequests').doc();
	await ref.set(data);
	res.status(201).json({ id: ref.id, ...data });
});
app.patch('/api/certificate-requests/:id', async (req, res) => {
	await db.collection('certificateRequests').doc(req.params.id).update(req.body);
	res.json({ id: req.params.id, ...req.body });
});
app.delete('/api/certificate-requests/:id', async (req, res) => {
	await db.collection('certificateRequests').doc(req.params.id).delete();
	res.status(204).end();
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(`API listening on :${port}`);
});