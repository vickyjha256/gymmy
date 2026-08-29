import { AppError } from "../../common/utils/AppError";
import * as gymRepository from "./gym.repository";
import { UpdateGymInput } from "./gym.validation";

export const getGym = async (gymId: string) => {
  const gym = await gymRepository.findById(gymId);

  if (!gym) {
    throw new AppError("Gym not found.", 404);
  }

  return gym;
};

export const updateGym = async (
  gymId: string,
  data: UpdateGymInput
) => {
  const gym = await gymRepository.findById(gymId);

  if (!gym) {
    throw new AppError("Gym not found.", 404);
  }

  return gymRepository.update(gymId, data);
};