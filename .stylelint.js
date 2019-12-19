module.exports = {
  extends: "stylelint-config-standard",
  rules: {
    "selector-pseudo-class-no-unknown": [
      true, 
      { ignorePseudoClasses: ['local', 'global'] }
    ],
    "rule-empty-line-before": [
      "always", 
      { except: ["inside-block"] }
    ]
  }
}
