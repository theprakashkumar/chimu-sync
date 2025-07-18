import { z } from "zod";
import { TaskPriorityEnum, TaskStatusEnum } from "../enums/taskEnum";
export const taskIdSchema = z.string().trim().min(1);

// export const taskCode =
export const titleSchema = z.string().trim().min(1).max(255);
export const descriptionSchema = z.string().trim().optional();
export const taskCode = z.string().trim();
export const prioritySchema = z.enum(
  Object.values(TaskPriorityEnum) as [string, ...string[]]
);
export const statusSchema = z.enum(
  Object.values(TaskStatusEnum) as [string, ...string[]]
);
export const assignedToSchema = z.string().trim().min(1).nullable().optional();
// The .refine() method here is used to add a custom validation to the schema.
// It checks that if a value is provided (i.e., not empty), it must be a valid date string that can be parsed by Date.parse().
// If the value is present and cannot be parsed as a date, it will fail validation with the message "Invalid data format."
export const dueDateSchema = z
  .string()
  .trim()
  .optional()
  .refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Invalid data format.",
  });

export const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  status: statusSchema,
  priority: prioritySchema,
  assignedTo: assignedToSchema,
  dueDate: dueDateSchema,
});

export const updateTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
  assignedTo: assignedToSchema,
  dueDate: dueDateSchema,
});
