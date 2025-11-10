import { deleteUserByNIK } from "../../services/user/deleteUserByNIK.service.js";

export const deleteUser = async (req, res, next) => {
  const { usernik } = req.params;

  try {
    const actornik = req.user?.NIK;
    if (!actornik) {
      const error = new Error("Actor NIK not found");
      error.statusCode = 404;
      throw error;
    }

    const deletedUser = await deleteUserByNIK(usernik, actornik);

    res.status(200).json({
      status: "success",
      message: "successfully deleted user data",
      data: deletedUser,
    });
  } catch (error) {
    error.cause = error.message;
    error.message = "failed to delete user data";
    next(error);
  }
};
