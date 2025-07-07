// Transaction let you execute multiple operation in isolation and potentially undo all the operation if one of them fails.
import "dotenv/config";
import mongoose from "mongoose";
import connectDatabase from "../config/databaseConfig";
import RoleModel from "../models/rolePermissionModel";
import { RolePermissions } from "../utils/rolePermission";

const seedRoles = async () => {
  console.log("Seeding role started...");
  try {
    // We will run this seeder file independently so we need to connect to database here:
    await connectDatabase();
    // To create a transaction we first need to create a session.
    console.info("Session started!");
    const session = await mongoose.startSession();
    session.startTransaction();
    // Before we populate data we need to delete exiting data.
    await RoleModel.deleteMany({}, { session });

    for (const roleName in RolePermissions) {
      const role = roleName as keyof typeof RolePermissions;
      const permissions = RolePermissions[role];
      // Check if role already exists
      const existingRole = await RoleModel.findOne({ name: role }).session(
        session
      );

      if (!existingRole) {
        const newRole = new RoleModel({
          name: role,
          permissions: permissions,
        });

        await newRole.save({ session });
        console.info(`Role ${role} added with permission.`);
      } else {
        console.info(`Role ${role} already exists.`);
      }
    }
    await session.commitTransaction();
    console.info("Transaction committed.");

    session.endSession();
    console.info("Session ended!");
    console.info("Seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
};

seedRoles().catch((error) =>
  console.error("Error while seeding the DB:", error)
);
