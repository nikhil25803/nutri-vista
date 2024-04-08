import { OnboardUserToDB } from "@/app/helpers/userToDB";
import nextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      return session;
    },
    async signIn({ profile }) {
      try {
        // Onboard user to DB
        const onboardUser = await OnboardUserToDB(profile);

        // If user has been added to DB successfully or not.
        if (onboardUser) {
          return true;
        }
        return false;
      } catch (error) {
        console.log("Error: ", error);
        return false;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth",
  },
};

const handler = nextAuth(authOptions);

export { handler as GET, handler as POST };
