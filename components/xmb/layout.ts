/**
 * Shared XMB geometry, in `em` relative to the screen's font-size.
 *
 * The screen sets `fontSize: 1.8vw` and its width is 55.8vw, so the screen is
 * always 31em wide regardless of viewport. Expressing every measurement in `em`
 * therefore makes the whole layout proportional to the screen, not the browser.
 * Mixing in px/rem/vw is what made the column drift: fixed and proportional
 * terms can only agree at one viewport width.
 */

export const SCREEN_WIDTH_EM = 31;

export const RAIL_PADDING_EM = 1.2;
export const CATEGORY_SLOT_EM = 5.9;
export const CATEGORY_GAP_EM = 5;
export const CATEGORY_STEP_EM = CATEGORY_SLOT_EM + CATEGORY_GAP_EM;

/**
 * The rail renders a leading spacer column, then the categories, and translates
 * left by one step per selected index — so the selected icon always lands here.
 */
export const SELECTED_CATEGORY_CENTER_EM =
  RAIL_PADDING_EM + CATEGORY_STEP_EM + CATEGORY_SLOT_EM / 2;

export const ITEM_ROW_PADDING_EM = 1.05;

/** Fixed slot so icons of differing sizes still share one centre line. */
export const ITEM_ICON_SLOT_EM = 2.4;

/** Derived, never tuned: keeps the column centred under the selected category. */
export const ITEM_LIST_PADDING_EM =
  SELECTED_CATEGORY_CENTER_EM - ITEM_ROW_PADDING_EM - ITEM_ICON_SLOT_EM / 2;

export const ITEM_LIST_WIDTH_EM = 16;

/** Row gap between the icon slot and the text column. */
export const ITEM_ICON_TEXT_GAP_EM = 0.75;

export const ITEM_TEXT_MAX_EM =
  ITEM_LIST_WIDTH_EM -
  ITEM_ROW_PADDING_EM * 2 -
  ITEM_ICON_SLOT_EM -
  ITEM_ICON_TEXT_GAP_EM;
