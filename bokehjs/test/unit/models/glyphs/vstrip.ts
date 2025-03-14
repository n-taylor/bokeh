import {expect} from "assertions"

import type {DataOf} from "./_util"
import {create_glyph_view} from "./_util"
import {VStrip} from "@bokehjs/models/glyphs/vstrip"
import type {Geometry} from "@bokehjs/core/geometry"
import {assert} from "@bokehjs/core/util/assert"

describe("VStrip", () => {

  it("should calculate bounds", async () => {
    const glyph = new VStrip()
    const data = {x0: [0, 5, 5, 10, 50], x1: [1, 7, 8, 15, 80]} satisfies DataOf<VStrip>
    const glyph_view = await create_glyph_view(glyph, data)
    const bounds = glyph_view.bounds()
    expect(bounds).to.be.equal({x0: 0, x1: 80, y0: NaN, y1: NaN})
  })

  it("should calculate log bounds", async () => {
    const glyph = new VStrip()
    const data = {x0: [0, 5, 5, 10, 50], x1: [1, 7, 8, 15, 80]} satisfies DataOf<VStrip>
    const glyph_view = await create_glyph_view(glyph, data)
    const log_bounds = glyph_view.log_bounds()
    expect(log_bounds).to.be.equal({x0: 5, x1: 80, y0: NaN, y1: NaN})
  })

  describe("_hit_point", () => {

    it("should return indices of the VStrip that was hit", async () => {
      const glyph = new VStrip()
      const data = {x0: [0, 5, 5, 10, 50], x1: [1, 7, 8, 15, 80]} satisfies DataOf<VStrip>
      const glyph_view = await create_glyph_view(glyph, data, {axis_type: "linear"})

      const {x_scale, y_scale} = glyph_view.parent.coordinates
      function compute(x: number, y: number) {
        return {sx: x_scale.compute(x), sy: y_scale.compute(y)}
      }

      const geometry0: Geometry = {type: "point", ...compute(0,  50)}
      const geometry1: Geometry = {type: "point", ...compute(5,  50)}
      const geometry2: Geometry = {type: "point", ...compute(7,  50)}
      const geometry3: Geometry = {type: "point", ...compute(8,  50)}
      const geometry4: Geometry = {type: "point", ...compute(10, 50)}
      const geometry5: Geometry = {type: "point", ...compute(50, 50)}
      const geometry6: Geometry = {type: "point", ...compute(90, 50)}

      const result0 = glyph_view.hit_test(geometry0)
      const result1 = glyph_view.hit_test(geometry1)
      const result2 = glyph_view.hit_test(geometry2)
      const result3 = glyph_view.hit_test(geometry3)
      const result4 = glyph_view.hit_test(geometry4)
      const result5 = glyph_view.hit_test(geometry5)
      const result6 = glyph_view.hit_test(geometry6)

      assert(result0 != null)
      assert(result1 != null)
      assert(result2 != null)
      assert(result3 != null)
      assert(result4 != null)
      assert(result5 != null)
      assert(result6 != null)

      expect(result0.indices).to.be.equal([0])
      expect(result1.indices).to.be.equal([1, 2])
      expect(result2.indices).to.be.equal([1, 2])
      expect(result3.indices).to.be.equal([2])
      expect(result4.indices).to.be.equal([3])
      expect(result5.indices).to.be.equal([4])
      expect(result6.indices).to.be.equal([])
    })
  })
})
