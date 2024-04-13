import { connectDB } from "@/db/dbConfig";
import UserModel from "@/models/userModel";

export const OnboardUserToDB = async (authBody: any) => {
  try {
    await connectDB();

    // Extracting email
    const userEmail = authBody.email;

    const userExist = await UserModel.findOne({ email: userEmail });

    // User do not exist in the DB
    if (!userExist) {
      const onboardPayload: { [key: string]: string | Array<object> } = {};

      // Format Username
      const formattedUsername = userEmail.split("@")[0].replace(/\./g, "");

      // Add data to payload accordingly
      onboardPayload.username = formattedUsername;
      onboardPayload.name = authBody.name;
      onboardPayload.email = authBody.email;
      onboardPayload.nutrientsData = [];

      if (authBody?.sub) {
        onboardPayload.avatarUrl = authBody.picture;
      } else {
        onboardPayload.avatarUrl = authBody.avatar_url;
      }

      // Define new user
      const newUser = new UserModel(onboardPayload);

      // Create new user
      const savedUser = await newUser.save();

      if (savedUser) {
        return true;
      }
      return false;
    }

    // User exist
    return true;
  } catch (error) {

    return false;
  }
};
