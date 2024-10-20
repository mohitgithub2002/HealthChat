import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';

export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, password } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: 'User created successfully', user: { id: user._id, name: user.name, email: user.email } }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 });
  }
}
