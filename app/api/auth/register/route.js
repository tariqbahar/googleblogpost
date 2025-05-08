// app/api/auth/register/route.js
import User from '@/models/User';
import connectDB from '@/libs/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await connectDB();


  // Parse request body
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Invalid or malformed JSON body' },
      { status: 400 }
    );
  }

  try {
    const { name, email, password, phone } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User already exists. Please login instead.' 
        },
        { status: 400 }
      );
    }

    // Create new user (password will be hashed by User model pre-save hook)
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // Plain password - will be hashed by pre-save hook
      phone: phone ? phone.trim() : null,
      provider: 'credentials',
    });

    // Save user (this triggers password hashing)
    await newUser.save();

    // Return success response (without sensitive data)
    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          provider: newUser.provider,
          createdAt: newUser.createdAt
        },
      },
      { status: 201 }
    );

  } catch (error) {
    
    // Handle specific errors
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return NextResponse.json(
        { success: false, errors, message: 'Validation failed' },
        { status: 400 }
      );
    }

    // Generic server error
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error during registration',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; // Recommended for Next.js API routes