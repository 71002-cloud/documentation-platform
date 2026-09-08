const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin-routes');
const projectRoutes = require('./routes/projects');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);

app.get('/health', (req, res) => {
	res.json({ ok: true });
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
