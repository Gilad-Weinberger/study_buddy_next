import User from "./models/userModel";

export default async function createUser(user: {
  name: string;
  email: string;
  image: string;
}) {
  try {
    const existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
      const newUser = new User({
        name: user.name,
        email: user.email,
        image: user.image,
      });
      await newUser.save();
      const plainUser = newUser.toObject();
      plainUser._id = plainUser._id.toString();
      return plainUser;
    } else {
      const plainUser = existingUser.toObject();
      plainUser._id = plainUser._id.toString();
      return plainUser;
    }
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    return null;
  }
}
