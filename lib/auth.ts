import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin } from "better-auth/plugins";
import { adminAc, userAc } from "better-auth/plugins/admin/access";

import { isUserRole, USER_ROLES } from "@/lib/roles";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("hireloop");

/**
 * Standard Schema validator for the `role` field so only the
 * supported roles ("seeker" | "recruiter" | "admin") reach the database.
 */
const roleValidator = {
    "~standard": {
        version: 1 as const,
        vendor: "hireloop",
        validate: (value: unknown) =>
            isUserRole(value)
                ? { value }
                : {
                    issues: [
                        {
                            message: `Role must be one of: ${USER_ROLES.join(", ")}`,
                        },
                    ],
                },
    },
};

export const auth = betterAuth({
    plugins: [
        admin({
            // Register HireLoop's three roles so the admin API accepts them
            // when an admin changes a user's role from the users page.
            roles: {
                admin: adminAc,
                recruiter: userAc,
                seeker: userAc,
            },
        }),
    ],
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                // The admin plugin owns this field and marks it input:false.
                // The sign-up form sends `signupRole` instead, and the create
                // hook below copies it onto `role` before saving.
                input: false,
                required: true,
                validator: {
                    input: roleValidator,
                },
            },
            signupRole: {
                type: "string",
                input: true,
                required: false,
                returned: false,
                validator: {
                    input: roleValidator,
                },
            },
            premium: {
                type: "boolean",
                required: false,
                defaultValue: false,
                input: false,
            },
        },

    },

    databaseHooks: {
        user: {
            create: {
                // Backstop: never persist a user without a valid role,
                // even if a future code path bypasses the field validator.
                before: async (user) => {
                    const { signupRole, ...rest } = user as typeof user & {
                        signupRole?: unknown;
                    };
                    const role = signupRole ?? user.role;

                    if (!isUserRole(role)) {
                        throw APIError.from("BAD_REQUEST", {
                            code: "MISSING_ROLE",
                            message: `Please choose a role: ${USER_ROLES.join(", ")}`,
                        });
                    }

                    // `signupRole` is only a transport field — clear it so the
                    // adapter doesn't persist it (hooks merge, not replace).
                    return {
                        data: { ...rest, role, signupRole: undefined },
                    };
                },
            },
        },
    },
});
