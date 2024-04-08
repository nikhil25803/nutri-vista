import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  avatarUrl: {
    type: String,
    required: [true, "Avatar URL is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  nutrientsData: [
    {
      protein: {
        type: Number,
        required: [true, "Protein value is required"],
      },
      carbs: {
        type: Number,
        required: [true, "Carbs value is required"],
      },
      sugars: {
        type: Number,
        required: [true, "Sugars value is required"],
      },
      fats: {
        type: Number,
        required: [true, "Fats value is required"],
      },
      sodium: {
        type: Number,
        required: [true, "Sodium value is required"],
      },
      calories: {
        type: Number,
        required: [true, "Calories value is required"],
      },
      day: {
        type: Number,
        required: [true, "Day value is required"],
      },
      month: {
        type: Number,
        required: [true, "Month value is required"],
      },
      year: {
        type: Number,
        required: [true, "Year value is required"],
      },
      date: {
        type: Date,
        required: [true, "Date is required"],
      },
    },
  ],
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
