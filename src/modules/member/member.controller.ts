import { NextFunction, Request, Response } from "express";
import * as memberService from "./member.service";
import { createMemberSchema } from "./member.validation";

export const createMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createMemberSchema.parse(req.body);

    const member = await memberService.createMember(
      req.user!.gymId,
      data
    );

    res.status(201).json({
      success: true,
      message: "Member created successfully.",
      data: member,
    });
  } catch (error) {
    next(error);
  }
};