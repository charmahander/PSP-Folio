/**
 * XMB geometry in the PSP's native 480x272 pixel grid.
 *
 * Sizes come from Sony's PSP Custom Theme spec; positions and steps are
 * measured off the project's Frame 61-64 mockups, which are authored at 483px
 * wide. The screen element is 31em across, so one design pixel is 31/480 em -
 * writing everything this way keeps these numbers readable against the spec
 * while still scaling with the device. Mixing in px/rem/vw would reintroduce
 * the drift that made the column slide as the viewport changed.
 */

export const SCREEN_W = 480;
export const SCREEN_H = 272;
const SCREEN_EM = 31;

/** Design pixels to an em string. */
export const px = (n: number) => `${((n * SCREEN_EM) / SCREEN_W).toFixed(4)}em`;

// --- Horizontal category bar -------------------------------------------------
/**
 * Sony's 64x48 figure is the image canvas, which its wide category glyphs fill.
 * Our source art is square, so a 64x48 box would render only 48px and leave the
 * category smaller than its own items - the opposite of the hardware, where a
 * category icon clearly outsizes the column beneath it. Sized by that intent.
 */
export const CATEGORY_ICON = 64;
/** Active is only slightly larger; the row should not lurch as it moves. */
export const CATEGORY_UNSELECTED_SCALE = 0.84;
export const CATEGORY_STEP = 144;
/** Selected category sits left of centre, not in the middle. */
export const CATEGORY_X = 167;
export const CATEGORY_Y = 78;
export const CATEGORY_CELL_W = 136;
export const CATEGORY_LABEL_SIZE = 11;
export const CATEGORY_LABEL_GAP = 6;

// --- Vertical item column ----------------------------------------------------
/** The column hangs off the selected category, so it shares that axis exactly. */
export const ITEM_X = CATEGORY_X;
/** "The selected item is always the first line under the primary row." */
export const ITEM_Y = 168;
export const ITEM_STEP = 71;
/** Items above the selection clear the band the category row occupies. */
export const ITEM_ABOVE_BAR_SKIP = 79;

/** Kept below CATEGORY_ICON so each level reads as subordinate to its parent. */
export const ITEM_ICON_FOCUS = 46;
export const ITEM_ICON_BODY = 34;
export const SUB_ICON_FOCUS = 34;
export const SUB_ICON_BODY = 26;

export const ITEM_TEXT_GAP = 12;
export const ITEM_TITLE_SIZE = 13;
export const ITEM_SUBTITLE_SIZE = 10;
export const ITEM_TEXT_MAX = 224;

export function itemOffsetY(offset: number): number {
  return ITEM_Y + offset * ITEM_STEP - (offset < 0 ? ITEM_ABOVE_BAR_SKIP : 0);
}

// --- Status bar --------------------------------------------------------------
/** 8px is the gutter that recurs throughout the Sony spec. */
export const GUTTER = 8;
export const STATUS_TEXT_SIZE = 13;
export const STATUS_ICON = 26;
export const STATUS_GAP = 10;
