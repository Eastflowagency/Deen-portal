const { test } = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { resolve, dirname } = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
function load(file) {
  const module = { exports: {} }
  vm.runInNewContext(ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{
    module,exports:module.exports,
    require(name) { return load(resolve(dirname(file),name+'.ts')) },
  })
  return module.exports
}
const { CATALOG, LEVELS, getPortalCourse } = load(resolve(__dirname,'../lib/curriculum/index.ts'))
const { lessonsForCourse } = load(resolve(__dirname,'../lib/curriculum/lessons.ts'))
test('level one uses the agreed book subjects and one annual Arabic course', () => {
  assert.deepEqual(Array.from(CATALOG.filter(c => c.levelNumber === 1),c => c.slug).sort(),['adab-1','aqidah-1','arabisk-1','dua-dhikr-1','fiqh-1','seerah-1'])
  assert.equal(getPortalCourse(1,'tazkiyah').subject,'Tazkiyah')
  for(const level of LEVELS) {
    const arabic = CATALOG.filter(c => c.levelNumber === level.id && c.subject === 'Arabisk')
    assert.equal(arabic.length,1)
    assert.equal(arabic[0].name,`Arabisk ${level.id}`)
    assert.ok(arabic[0].dato.semester.toLowerCase().includes('høst') && arabic[0].dato.semester.toLowerCase().includes('vår'))
  }
})
test('each canonical course has a detail entry and resolves to its own level', () => {
  assert.equal(new Set(CATALOG.map(c => c.slug)).size,CATALOG.length)
  for(const course of CATALOG) {
    assert.ok(course.name && course.level && course.dato)
    assert.equal(getPortalCourse(course.levelNumber,course.slug),course)
  }
  assert.equal(getPortalCourse(99,'aqidah'),undefined)
  assert.equal(getPortalCourse(1,'missing'),undefined)
  assert.equal(getPortalCourse(1,'aqidah').slug,'aqidah-1')
})
test('only the actual Aqidah recording is published; other courses do not inherit its lessons', () => {
  assert.equal(lessonsForCourse('aqidah-1').length,1)
  assert.ok(lessonsForCourse('aqidah-1')[0].src.startsWith('https://'))
  for(const course of CATALOG.filter(c => c.slug !== 'aqidah-1')) assert.equal(lessonsForCourse(course.slug).length,0)
})
