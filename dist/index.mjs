// src/index.ts
import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
import plugin from "tailwindcss/plugin";
import withAlphaVariable, { withAlphaValue } from "tailwindcss/lib/util/withAlphaVariable";

// src/config.ts
var variableConfig = {
  bg: { attrs: ["background-color"], plugin: "backgroundOpacity", variable: "--tw-bg-opacity" },
  text: { attrs: ["color"], plugin: "textOpacity", variable: "--tw-text-opacity" },
  decoration: { attrs: ["text-decoration-color"] },
  "border-x": {
    attrs: ["border-left-color", "border-right-color"],
    plugin: "borderOpacity",
    variable: "--tw-border-opacity"
  },
  "border-y": {
    attrs: ["border-top-color", "border-bottom-color"],
    plugin: "borderOpacity",
    variable: "--tw-border-opacity"
  },
  "border-t": { attrs: ["border-top-color"], plugin: "borderOpacity", variable: "--tw-border-opacity" },
  "border-r": { attrs: ["border-right-color"], plugin: "borderOpacity", variable: "--tw-border-opacity" },
  "border-b": { attrs: ["border-bottom-color"], plugin: "borderOpacity", variable: "--tw-border-opacity" },
  "border-l": { attrs: ["border-left-color"], plugin: "borderOpacity", variable: "--tw-border-opacity" },
  border: { attrs: ["border-color"], plugin: "borderOpacity", variable: "--tw-border-opacity" },
  outline: { attrs: ["outline-color"] },
  accent: { attrs: ["accent-color"] },
  caret: { attrs: ["caret-color"] },
  fill: { attrs: ["fill"] },
  stroke: { attrs: ["stroke"] },
  divide: { attrs: ["border-color"], plugin: "divideOpacity", variable: "--tw-divide-opacity" },
  shadow: { attrs: ["--tw-shadow-color"] },
  "ring-offset": { attrs: ["--tw-ring-offset-color"] },
  ring: { attrs: ["--tw-ring-color"], plugin: "ringOpacity", variable: "--tw-ring-opacity" }
};
var prefixes = Object.keys(variableConfig);
var modifierPairMap = {
  white: "black",
  black: "white",
  50: "900",
  100: "800",
  200: "700",
  300: "600",
  400: "500",
  500: "400",
  600: "300",
  700: "200",
  800: "100",
  900: "50"
};

// src/parser.ts
function parseClassColor(className) {
  const prefix = prefixes.find((pfx) => className.startsWith(`${pfx}-`));
  if (!prefix)
    return false;
  className = className.slice(prefix.length + 1);
  let result;
  if (result = /^([\w-]+)-(\d+)$/i.exec(className)) {
    return {
      prefix,
      color: result[1],
      shade: result[2]
    };
  } else if (result = /^([\w-]+)-(\d+)\/(\d*\.?\d+)$/i.exec(className)) {
    return {
      prefix,
      color: result[1],
      shade: result[2],
      opacity: result[3]
    };
  } else if (result = /^([\w-]+)$/i.exec(className)) {
    return {
      prefix,
      color: result[1]
    };
  } else if (result = /^([\w-]+)\/(\d*\.?\d+)$/i.exec(className)) {
    return {
      prefix,
      color: result[1],
      opacity: result[2]
    };
  }
  return false;
}

// src/index.ts
var wrapMediaDarkRule = (() => {
  const darkRule = postcss.atRule({
    name: "media",
    params: "(prefers-color-scheme: dark)"
  });
  return (rule) => {
    rule.replaceWith(
      darkRule.clone({
        nodes: [rule]
      })
    );
  };
})();
var addDarkClass = (selector, className = "dark") => {
  const parser = selectorParser((selectors) => {
    selectors.each((selector2) => {
      const firstChild = selector2.at(0);
      selector2.insertBefore(firstChild, selectorParser.className({ value: className }));
      selector2.insertBefore(firstChild, selectorParser.combinator({ value: " " }));
    });
  });
  return parser.processSync(selector);
};
var getReverseColor = ({
  selector,
  classColor,
  theme
}) => {
  if (classColor.shade && classColor.shade in modifierPairMap) {
    return theme(["colors", classColor.color, modifierPairMap[classColor.shade]]);
  } else if (classColor.color in modifierPairMap) {
    return theme(["colors", modifierPairMap[classColor.color]]);
  }
  return "";
};
var bicolor = ({ variantName = "bi", getColor = getReverseColor } = {}) => plugin(({ addVariant, config, theme, e: encode, corePlugins }) => {
  const darkMode = config("darkMode", "media");
  addVariant(variantName, [
    "&",
    ({ container, separator }) => {
      container.walkRules((rule) => {
        const bareSelector = rule.selector.slice(1).replace(/\\\//g, "/").split(" ")[0];
        const classColor = parseClassColor(bareSelector);
        if (!classColor)
          return;
        const colorConfig = variableConfig[classColor.prefix];
        const color = getColor({ selector: bareSelector, classColor, theme });
        if (!color)
          return;
        rule.walkDecls((decl) => {
          if (colorConfig.attrs.includes(decl.prop)) {
            decl.value = classColor.opacity ? withAlphaValue(color, Number(classColor.opacity) / 100) : colorConfig.variable && corePlugins(colorConfig.plugin) ? withAlphaVariable({
              color,
              property: "color",
              variable: colorConfig.variable
            }).color : color;
          } else if (decl.prop.startsWith("--")) {
            decl.remove();
            return;
          }
        });
        if (darkMode === "class") {
          rule.selector = addDarkClass(`.${variantName}${encode(`${separator}${bareSelector}`)}`);
        } else if (Array.isArray(darkMode) && darkMode.includes("class")) {
          rule.selector = addDarkClass(
            `.${variantName}${encode(`${separator}${bareSelector}`)}`,
            darkMode[1]
          );
        } else {
          wrapMediaDarkRule(rule);
        }
      });
    }
  ]);
});
var src_default = bicolor;
export {
  bicolor,
  src_default as default,
  getReverseColor
};
