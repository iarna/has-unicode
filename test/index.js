"use strict"
var test = require("tap").test
var requireInject = require("require-inject")

test("Windows", function (t) {
  t.plan(1)
  var hasUnicode = requireInject("../index.js", {
    os: { type: function () { return "Windows_NT" } }
  })
  t.is(hasUnicode(), false, "Windows is assumed NOT to be unicode aware")
})
test("Unix Env", function (t) {
  var hasUnicode = requireInject("../index.js", {
    os: { type: function () { return "Linux" } },
    child_process: { exec: function (cmd,cb) { cb(new Error("not available")) } }
  })
  function test3(LC_ALL, LC_CTYPE, LANG, expected, comment) {
    var env = process.env
    if (LC_ALL)   env.LC_ALL   = LC_ALL;   else delete env.LC_ALL
    if (LC_CTYPE) env.LC_CTYPE = LC_CTYPE; else delete env.LC_CTYPE
    if (LANG)     env.LANG     = LANG;     else delete env.LANG
    t.is(hasUnicode(), expected, comment)
  }
  test3(null, null, "en_US.UTF-8", true, "Linux with a UTF-8 language")
  test3("en_US.UTF-8", null, null, true, "Linux with UTF-8 locale")
  test3(null, null, null, false, "Linux with no locale setting at all")
  test3(null, "en_US.UTF-8", null, true, "Linux with UTF-8 in character type")
  test3(null, "UTF-8", null, true, "Linux with UTF-8 as character type")
  test3("C", "en_US.UTF-8", "en_US.UTF-8", false, "LC_ALL overrides")
  test3(null, "en_US", "en_US.UTF-8", false, "LC_CTYPE overrides LANG")
  test3(null, null, null, false, "Linux with no locale setting at all")
  test3(null, null, "de_DE.utf8", true, "Linux with utf8 language")
  t.end()
})
