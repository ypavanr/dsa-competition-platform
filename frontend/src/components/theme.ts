// src/components/theme.ts
import { createSystem, defaultConfig } from "@chakra-ui/react"

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        gray: {
          50: { value: "#f9fafb" },
          200: { value: "#e5e7eb" },
          500: { value: "#6b7280" },
        },
      },
    },
  },
})
