import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const POST = async (request: Request) => {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username); // decodes endoded value
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    // Check if the code is correct and not expired
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Update the user's verification status
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 },
      );
    } else if (!isCodeNotExpired) {
      // Code has expired
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired. Please sign up again to get a new code.",
        },
        { status: 400 },
      );
    } else {
      // Code is incorrect
      return Response.json(
        { success: false, message: "Incorrect verification code" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error Verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying username",
      },
      {
        status: 500,
      },
    );
  }
};
