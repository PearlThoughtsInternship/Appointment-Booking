import { OAuth2Client } from "google-auth-library"
import jwt from "jsonwebtoken"
import { Effect } from "effect"
import { HttpServerResponse } from "@effect/platform"
import type { HttpServerRequest } from "@effect/platform/HttpServerRequest"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const googleAuthHandler = (req: HttpServerRequest) =>
  Effect.gen(function* () {
    const body = yield* req.json

    const { token, role } = body as {
      token: string
      role: "PATIENT" | "DOCTOR"
    }

    if (!token || !role) {
      return HttpServerResponse.json(
        { message: "token and role are required" },
        { status: 400 }
      )
    }

    const ticket = yield* Effect.promise(() =>
      client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      })
    )

    const payload = ticket.getPayload()
    if (!payload || !payload.email) {
      return HttpServerResponse.json(
        { message: "Invalid Google token" },
        { status: 400 }
      )
    }

    const user = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      role,
      provider: "google",
    }

    const jwtToken = jwt.sign(user, process.env.JWT_SECRET || "dev-secret", {
      expiresIn: "7d",
    })

    return HttpServerResponse.json({
      token: jwtToken,
      user,
    })
  })
