const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());

// Route to mark attendance
app.post('/api/attendance', async (req, res) => {
    const { studentId, classId } = req.body;

    try {
        // Check if the attendance is already marked
        const existingAttendance = await prisma.attendance.findFirst({
            where: {
                studentId,
                classId,
            },
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance already marked for this student in this class.' });
        }

        // Mark attendance
        const attendance = await prisma.attendance.create({
            data: {
                studentId,
                classId,
            },
        });

        res.status(201).json({
            message: 'Attendance marked successfully',
            attendance,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to mark attendance' });
    }
});

// Route to get attendance for a specific student
app.get('/api/attendance/:studentId', async (req, res) => {
    const { studentId } = req.params;

    try {
        const attendance = await prisma.attendance.findMany({
            where: {
                studentId: parseInt(studentId),
            },
            include: {
                class: true,
            },
        });

        res.status(200).json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve attendance' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
