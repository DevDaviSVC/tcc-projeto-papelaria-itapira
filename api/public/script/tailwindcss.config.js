tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            primary: "#7C05F2",
            secondary: "#EE0CF2",
            accent: "#14F20C",
            warm: "#F25D07",
            "light-bg": "#F2F2F2",
          },
          fontFamily: {
            display: ["DynaPuff", "system-ui", "sans-serif"],
            sans: ["Plus Jakarta Sans", "sans-serif"],
          },
          borderRadius: {
            blob: "30% 70% 70% 30% / 30% 30% 70% 70%",
            xl: "1.5rem",
            "2xl": "2.5rem",
          },
          animation: {
            float: "float 6s ease-in-out infinite",
            wiggle: "wiggle 1s ease-in-out infinite",
          },
          keyframes: {
            float: {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-20px)" },
            },
            wiggle: {
              "0%, 100%": { transform: "rotate(-3deg)" },
              "50%": { transform: "rotate(3deg)" },
            },
          },
        },
      },
    };