import { NextFunction, Request, Response } from "express";
import * as memberService from "./member.service";
import { createMemberSchema } from "./member.validation";

import { ParamsDictionary } from "express-serve-static-core";


type MemberParams = ParamsDictionary & {
  id: string;
};

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


export const getMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;

    const result = await memberService.getMembers(
      req.user!.gymId,
      page,
      limit,
      search
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};



export const getMemberById = async (
  req: Request<MemberParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const member = await memberService.getMemberById(
      req.user!.gymId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};