import userEvent from '#src'
import {setup} from '#testHelpers'

describe('scroll', () => {
  test('sets the supplied scroll positions and dispatches scroll', async () => {
    const {element, getEvents, user} = setup('<div></div>')
    element.scrollLeft = 10

    await user.scroll(element, {top: 20})

    expect(element.scrollLeft).toBe(10)
    expect(element.scrollTop).toBe(20)
    expect(getEvents('scroll')).toHaveLength(1)
  })

  test('is available from the direct API', async () => {
    const element = document.createElement('div')
    const onScroll = mocks.fn()
    element.addEventListener('scroll', onScroll)

    await userEvent.scroll(element, {left: 20, top: 30})

    expect(element.scrollLeft).toBe(20)
    expect(element.scrollTop).toBe(30)
    expect(onScroll).toHaveBeenCalledTimes(1)
  })
})

describe('wheel', () => {
  test('dispatches a wheel event with the supplied deltas', async () => {
    const {element, getEvents, user} = setup('<div></div>')

    await user.wheel(element, {deltaX: 10, deltaY: -20, deltaZ: 30})

    const [event] = getEvents('wheel')
    expect(event).toMatchObject({
      deltaMode: WheelEvent.DOM_DELTA_PIXEL,
      deltaX: 10,
      deltaY: -20,
      deltaZ: 30,
    })
  })

  test('includes pressed modifier keys', async () => {
    const {element, getEvents, user} = setup('<div></div>')
    await user.keyboard('[ShiftLeft>]')

    await user.wheel(element)

    expect(getEvents('wheel')[0].shiftKey).toBe(true)
  })
})
