import { z } from "zod";

import { fieldLimits } from "@/lib/validation/limits";

export const displayNameSchema = z
  .string()
  .trim()
  .min(fieldLimits.displayName.min, "Enter a display name.")
  .max(
    fieldLimits.displayName.max,
    `Use at most ${fieldLimits.displayName.max} characters.`,
  );

export const bioSchema = z
  .string()
  .trim()
  .max(fieldLimits.bio, `Use at most ${fieldLimits.bio} characters.`);
