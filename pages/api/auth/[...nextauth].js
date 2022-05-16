// next
import NextAuth from "next-auth";
// providers
import GoogleProvider from "next-auth/providers/google";
// database
import clientPromise from "../../../src/utils/mongodb";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

export default NextAuth({
	session: { jwt: true },
	jwt: {
		encryption: true,
		secret: process.env.NEXTAUTH_SECRET,
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	adapter: MongoDBAdapter(clientPromise),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
	],
});
