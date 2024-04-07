import nextAuth from "next-auth";

import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      profile(profile) {
        console.log("Google Profile Data: ", profile);
        return {
          ...profile,
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        };
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        console.log("GitHub Profile Data: ", profile);
        return {
          ...profile,
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth",
  },
};

const handler = nextAuth(authOptions);
export { handler as GET, handler as POST };
