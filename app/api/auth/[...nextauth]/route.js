import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from '@/utils/dbConnect';
import User from '@/models/user'; // Assuming you have a User model

export const authOption = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},

            async authorize(credentials) {
                await dbConnect();
                const {email, password} = credentials;

                const user = await User.findOne({ email });
                if (!user) {
                    console.error('Authorization error: No user found');
                    throw new Error('No user found');
                }
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    throw new Error('Invalid password');
                }
                return user;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ],
    callbacks: {
        async jwt ({token, user}) {
            if(user){
                return {
                    ...token,
                }
            };
            return token;
        },
        async session({session, token}){
           
            return {
                ...session,
                user: {
                    ...session.user,
                },
            };
        },
        async signIn({ user, account, profile }) {
            await dbConnect();
            if (account.provider === 'google') {
                const userExists = await User.findOne({ email: user.email });

                if (!userExists) {
                    try {
                        const referralCode = user.email.slice(0, 5).toLowerCase();
                        await User.create({
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            referralCode: referralCode,
                        });
                    } catch (error) {
                        console.error('Error creating user:', error);
                        throw new Error('Failed to create user');
                    }
                }
                return true;
            }
            return true;
        },
    },
    session: {
        strategy : 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    
    secret : process.env.NEXTAUTH_SECRET,
    pages:{
        signIn: '/login',
    },
};

const handler = NextAuth(authOption);

export {handler as GET, handler as POST}
