// công thức tính rem dựa trên px
// 16px / 1536px * 100rem = con số rem ở man hình 1536px
// space block 40px->24px
// space section 60px

// const { plugin } = require("postcss");
const plugin = require("tailwindcss/plugin");
const { DEFAULT_CIPHERS } = require("tls");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx,scss}",
  ],
  theme: {
    extend: {
      // container=====
      container: {
        center: true,
        padding: {
          DEFAULT: "15px",
          md: "30px",
        },
        screens: {
          xs: "100vw",
          sm: "100vw",
          md: "100vw",
          lg: "1024px",
          xl: "1180px",
          "2xl": "1536px",
        },
      },

      // =====screen==========
      screens: {
        // set lại min xl
        xl: "1180px",

        // max width
        "-sm": {
          max: "639.98px",
        },
        "-md": {
          max: "767.98px",
        },
        "-lg": {
          max: "1023.98px",
        },
        "-xl": {
          max: "1179.98px",
        },
        "-2xl": {
          max: "1535.98px",
        },
      },

      keyframes: {
        // hiệu ứng line sale box sản phẩm
        effectScale: {
          "0%": {
            transform: "translateY(-50%) scale(1)",
            opacity: "1",
          },
          "50%": {
            transform: "translateY(-50%) scale(4.6)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(-50%) scale(1)",
            opacity: "0",
          },
        },
      },
      animation: {
        effectScale: "effectScale 1.8s ease-in-out infinite",
      },
      // màu sắc=====
      colors: {
        price: {
          old: "#9CA3AF",
        },
        // 3 mã màu chính cho web
        primaryColor: "#eff9ff",
        secondaryColor: "#073447",
        accentColor: "#1BBCFF",

        // các màu hover
        accentColorHover: "rgb(0, 173, 246)",

        // border
        bd: {
          primary: "#E5E7EB",
          f5: "#F5F5F5",
        },

        // màu text dark
        textGrayDark: "#4E4E4E",
        //
        neutral: {
          50: "#f6f6f6",
          100: "#efefef",
          150: "#e6e6e6",
          200: "#dcdcdc",
          300: "#bdbdbd",
          400: "#989898",
          500: "#818181",
          600: "#656565",
          700: "#525252",
          800: "#464646",
          900: "#3d3d3d",
          950: "#292929",
          White: "#ffffff",
          Black: "#000000",
        },
      },
      // ======fontsize=====
      fontSize: {
        title24: "24px",
        title20: "20px",
        xs: ["12px", { lineHeight: "1.33" }],
        sm: ["14px", { lineHeight: "1.43" }],
        base: ["16px", { lineHeight: "1.5" }],
        lg: ["18px", { lineHeight: "1.44" }],
        xl: ["20px", { lineHeight: "1.4" }],
        "2xl": ["24px", { lineHeight: "1.33" }],
      },
      // font family
      fontFamily: {
        awesome: ['"Font Awesome 6 Pro"'],
      },
      // =====spacing=====
      spacing: {
        md: "16px",
        lg: "20px",
        "2xl": "28px",
      },

      // ========gap=======
      // gap: {},
    },
  },
  // 2 khoảng giảm chính 1024px-lg, 1280px-xl
  plugins: [
    require("@tailwindcss/typography"),
    plugin(function ({ addComponents, theme, matchUtilities }) {
      addComponents({
        // =====style aside====
        ".style-aside": {
          padding: "16px 14px",
          background: theme("colors.primaryColor"),
          border: "1px solid theme('colors.bd.f5')",
          borderRadius: "8px",
        },

        // =====grid col=======
        ".grid-col5": {
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: theme("spacing.md"),
          [`@media (min-width: ${theme("screens.md")})`]: {
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          },
          [`@media (min-width: ${theme("screens.lg")})`]: {
            gap: theme("spacing.lg"),
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          },
          [`@media (min-width: ${theme("screens.xl")})`]: {
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          },
          [`@media (min-width: ${theme("screens.2xl")})`]: {
            gap: theme("spacing.2xl"),
          },
        },
        ".grid-col4": {
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: theme("spacing.md"),
          [`@media (min-width: ${theme("screens.md")})`]: {
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          },
          [`@media (min-width: ${theme("screens.lg")})`]: {
            gap: theme("spacing.lg"),
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          },
          [`@media (min-width: ${theme("screens.2xl")})`]: {
            gap: theme("spacing.2xl"),
          },
        },
        ".grid-col5-slide": {
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: "calc((100% - (theme('spacing.md') * 1)) / 2)",
          gap: "theme('spacing.md')",
          [`@media (min-width: ${theme("screens.md")})`]: {
            gridAutoColumns: "calc((100% - (theme('spacing.md') * 2)) / 3)",
          },
          [`@media (min-width: ${theme("screens.lg")})`]: {
            gap: theme("spacing.lg"),
            gridAutoColumns: "calc((100% - (theme('spacing.lg') * 3)) / 4)",
          },
          [`@media (min-width: ${theme("screens.xl")})`]: {
            gridAutoColumns: "calc((100% - (theme('spacing.lg') * 4)) / 5)",
          },
          [`@media (min-width: ${theme("screens.2xl")})`]: {
            gap: theme("spacing.2xl"),
            gridAutoColumns: "calc((100% - (theme('spacing.2xl') * 4)) / 5)",
          },
        },
        ".grid-col4-slide": {
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: "calc((100% - (theme('spacing.md') * 1)) / 2)",
          gap: "theme('spacing.md')",
          [`@media (min-width: ${theme("screens.md")})`]: {
            gridAutoColumns: "calc((100% - (theme('spacing.md') * 2)) / 3)",
          },
          [`@media (min-width: ${theme("screens.lg")})`]: {
            gap: theme("spacing.lg"),
            gridAutoColumns: "calc((100% - (theme('spacing.lg') * 3)) / 4)",
          },
          [`@media (min-width: ${theme("screens.2xl")})`]: {
            gap: theme("spacing.2xl"),
            gridAutoColumns: "calc((100% - (theme('spacing.2xl') * 3)) / 4)",
          },
        },

        // =========flex col======
        ".row": {
          display: "flex",
          flexWrap: "wrap",
          marginLeft: `calc(theme("spacing.md") / -2)`,
          marginRight: `calc(theme("spacing.md") / -2)`,
          [`@media (min-width: ${theme("screens.lg")})`]: {
            marginLeft: `calc(theme("spacing.lg") / -2)`,
            marginRight: `calc(theme("spacing.lg") / -2)`,
          },
          [`@media (min-width: ${theme("screens.2xl")})`]: {
            marginLeft: `calc(theme("spacing.2xl") / -2)`,
            marginRight: `calc(theme("spacing.2xl") / -2)`,
          },
        },

        // =====ratio box====
        ".ratio-box": {
          position: "relative",
          overflow: "hidden",
        },
        ".ratio-box-img": {
          position: "absolute",
          inset: "0",
        },
        ".ratio-img": {
          position: "absolute",
          left: "0",
          top: "0",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        },

        // =========section=========
        ".section-py": {
          padding: "14px 0",
          [`@media (min-width: ${theme("screens.lg")})`]: {
            padding: "20px 0",
          },
        },

        // ======clip-path title section=====
        ".clip-line-title": {
          clipPath: "polygon(0 0, 100% 0, 96% 100%, 0 100%)",
        },
        ".clip-tr-bl": {
          clipPath: "polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%,0 85%)",
        },
        ".clip-triangle": {
          clipPath: "polygon(0 0, 100% 0, 100% 100%)",
        },

        // ========margin========
        ".mt-base": {
          marginTop: theme("spacing.md"),
          [`@media (min-width: ${theme("screens.lg")})`]: {
            marginTop: theme("spacing.lg"),
          },
          [`@media (min-width: ${theme("screens.2xl")})`]: {
            marginTop: theme("spacing.2xl"),
          },
        },
        ".mb-base": {
          marginBottom: theme("spacing.md"),
          [`@media (min-width: ${theme("screens.lg")})`]: {
            marginBottom: theme("spacing.lg"),
          },
          [`@media (min-width: ${theme("screens.2xl")})`]: {
            marginBottom: theme("spacing.2xl"),
          },
        },

        // =======img========
        ".img-full": {
          width: "100%",
          height: "100%",
          objectFit: "cover",
        },
        ".img-contain": {
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        },

        // ========font-size=======
        ".title-32": {
          fontSize: "24px",
          fontWeight: "600",
          lineHeight: "1.33",
          [`@media (min-width: ${theme("screens.lg")})`]: {
            fontSize: "28px",
            lineHeight: "1.28",
          },
          [`@media (min-width: ${theme("screens.2xl")})`]: {
            fontSize: "32px",
            lineHeight: "1.25",
          },
        },
        ".title-24": {
          fontSize: "20px",
          fontWeight: "600",
          lineHeight: "1.4",
          [`@media (min-width: ${theme("screens.lg")})`]: {
            fontSize: "22px",
            lineHeight: "1.36",
          },
          [`@media (min-width: ${theme("screens.2xl")})`]: {
            fontSize: "24px",
            lineHeight: "1.33",
          },
        },
        ".title-20": {
          fontSize: "16px",
          fontWeight: "600",
          lineHeight: "1.5",
          [`@media (min-width: ${theme("screens.lg")})`]: {
            fontSize: "18px",
            lineHeight: "1.44",
          },
          [`@media (min-width: ${theme("screens.2xl")})`]: {
            fontSize: "20px",
            lineHeight: "1.4",
          },
        },

        // ==========gap========
        ".gap-base": {
          gap: theme("spacing.md"),
          [`@media (min-width: ${theme("screens.lg")})`]: {
            gap: theme("spacing.lg"),
          },
          [`@media (min-width: ${theme("screens.2xl")})`]: {
            gap: theme("spacing.2xl"),
          },
        },
        ".gap-x-base": {
          columnGap: theme("spacing.md"),
          [`@media (min-width: ${theme("screens.lg")})`]: {
            columnGap: theme("spacing.lg"),
          },
          [`@media (min-width: ${theme("screens.2xl")})`]: {
            columnGap: theme("spacing.2xl"),
          },
        },
        ".gap-y-base": {
          rowGap: theme("spacing.md"),
          [`@media (min-width: ${theme("screens.lg")})`]: {
            rowGap: theme("spacing.lg"),
          },
          [`@media (min-width: ${theme("screens.2xl")})`]: {
            rowGap: theme("spacing.2xl"),
          },
        },
        // ======== padding =========
        ".pl-base": {
          paddingLeft: theme("spacing.md"),
          [`@media (min-width: ${theme("screens.lg")})`]: {
            paddingLeft: theme("spacing.lg"),
          },
          [`@media (min-width: ${theme("screens.2xl")})`]: {
            paddingLeft: theme("spacing.2xl"),
          },
        },
        ".pr-base": {
          paddingRight: theme("spacing.md"),
          [`@media (min-width: ${theme("screens.lg")})`]: {
            paddingRight: theme("spacing.lg"),
          },
          [`@media (min-width: ${theme("screens.2xl")})`]: {
            paddingRight: theme("spacing.2xl"),
          },
        },

        // ===========flex==========
        ".flex-center": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        ".flex-between": {
          display: "flex",
          justifyContent: "space-between",
        },
        ".flex-between-center": {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
        ".flex-y-center": {
          display: "flex",
          alignItems: "center",
        },
        ".flex-x-center": {
          display: "flex",
          justifyContent: "center",
        },

        // ========transition=======
        ".transition-all-300-ease": {
          transition: "all 0.3s ease",
        },
        ".transition-all-500-ease": {
          transition: "all 0.5s ease",
        },
        ".transition-all-300-linear": {
          transition: "all 0.3s linear",
        },
        ".transition-all-500-linear": {
          transition: "all 0.5s linear",
        },
        "transition-bg-300-ease": {
          transition: "background 0.3s ease",
        },
        "transition-bg-500-ease": {
          transition: "background 0.5s ease",
        },
        "transition-bg-300-linear": {
          transition: "background 0.3s linear",
        },
        "transition-bg-500-linear": {
          transition: "background 0.5s linear",
        },
      });

      // ========ratio box==========

      matchUtilities(
        {
          ratio: (value) => {
            const [w, h] = value.split("_").map(Number);
            if (!w || !h) return {};
            return { paddingTop: `${(h / w) * 100}%` };
          },
        },
        {
          values: {
            "16_9": "16_9",
            "4_3": "4_3",
            "4_2": "4_2",
            "2_1": "2_1",
            "1_1": "1_1",
            "2_3": "2_3",
          },
        }
      );
    }),
    plugin(({ addVariant, e }) => {
      addVariant("ratio", ({ container, separator }) => {
        container.walkRules((rule) => {
          rule.selector = `.${e(`ratio${separator}`)}${rule.selector.slice(1)}`;
          rule.walkDecls((decl) => {
            const ratioValues = decl.value.split(" ");
            if (ratioValues.length === 2) {
              const num1 = parseInt(ratioValues[0]);
              const num2 = parseInt(ratioValues[1]);
              if (!isNaN(num1) && !isNaN(num2) && num2 !== 0) {
                const percentage = `${(num1 / num2) * 100}%`;
                decl.value = `${percentage}`;
              }
            }
          });
        });
      });
    }),
  ],
};
