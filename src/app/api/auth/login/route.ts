import { SignJWT } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import type { User } from '@/types';
import { LoginSchema, validateInput } from '@/lib/validation';

// Mock user data - replace with actual database query
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@purrify.ca',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'manager@purrify.ca',
    name: 'Sales Manager',
    role: 'manager',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock password verification - replace with actual password hashing
const verifyPassword = (email: string, _password: string): boolean => {
  // For demo purposes, accept any password for existing users
  return mockUsers.some(user => user.email === email);
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validation = validateInput(LoginSchema, body);
    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { error: validation.error, details: validation.errors },
        { status: 400 }
      );
    }

    const { email, password, rememberMe } = validation.data;

    // Find user
    const user = mockUsers.find(u => u.email === email);

    if (!user || !verifyPassword(email, password)) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    );

    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(rememberMe ? '30d' : '1d')
      .sign(secret);

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 1 day
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
