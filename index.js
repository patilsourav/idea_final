const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(cors());


app.get('api/students/', async (req, res) => {
  try {
    const students = await prisma.students.findMany()
    console.log('Students :', students)
    res.json(students)
  } catch (error) {
    console.error('Error!:', error)
    res.status(500).json({error: 'Failed to fetch students'})
  }
})