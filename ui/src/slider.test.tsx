// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { XSlider, Slider } from './slider'
import * as T from './qd'
import { initializeIcons } from '@fluentui/react'

const name = 'slider'
const sliderProps: Slider = { name }
const defaultRect = { left: 0, top: 0, right: 100, bottom: 40, width: 100, height: 40 } as DOMRect
const mouseEvent = { clientX: 50, clientY: 0 }

describe('Slider.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => { T.qd.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XSlider model={sliderProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not display slider when visible is false', () => {
    const { queryByTestId } = render(<XSlider model={{ ...sliderProps, visible: false }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
    expect(queryByTestId(name)).not.toBeVisible()
  })

  it('Sets args - init', () => {
    render(<XSlider model={sliderProps} />)
    expect(T.qd.args[name]).toBe(0)
  })

  it('Sets args - init - min specified', () => {
    render(<XSlider model={{ ...sliderProps, min: 1 }} />)
    expect(T.qd.args[name]).toBe(1)
  })

  it('Sets args - init - value specified', () => {
    render(<XSlider model={{ ...sliderProps, value: 101, max: 100 }} />)
    expect(T.qd.args[name]).toBe(100)
  })

  it('Sets args on slide', () => {
    const { container } = render(<XSlider model={sliderProps} />)
    container.querySelector('.ms-Slider-line')!.getBoundingClientRect = () => defaultRect
    fireEvent.mouseDown(container.querySelector('.ms-Slider-slideBox')!, mouseEvent)

    expect(T.qd.args[name]).toBe(50)
  })
  it('Calls sync on slide', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { container } = render(<XSlider model={{ ...sliderProps, trigger: true }} />)
    container.querySelector('.ms-Slider-line')!.getBoundingClientRect = () => defaultRect

    const slidebox = container.querySelector('.ms-Slider-slideBox')!
    fireEvent.mouseDown(slidebox, mouseEvent)
    fireEvent.mouseUp(slidebox, mouseEvent)

    expect(syncMock).toHaveBeenCalled()
  })

  it('Does not call sync on slide - trigger not specified', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock
    const { getByRole } = render(<XSlider model={sliderProps} />)
    fireEvent.mouseDown(getByRole('slider'), { clientX: 1, clientY: 1 })

    expect(syncMock).toHaveBeenCalledTimes(0)
  })

})