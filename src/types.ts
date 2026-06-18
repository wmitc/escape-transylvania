/**
 * Core type definitions for the Escape Transylvania game engine.
 *
 * The whole game is data-driven: rooms, items, and (later) puzzles are plain
 * data objects that generic components render. Adding content means editing the
 * files in `src/data/` rather than writing new components.
 */

export type RoomId = string
export type ItemId = string
export type PuzzleId = string
export type HotspotId = string

/** A collectable or usable object (key, torch, book, ...). */
export interface Item {
  id: ItemId
  name: string
  /** Emoji used as a placeholder icon until real art is added. */
  icon: string
  description: string
  /** Keys count toward unlocking the final castle gate. */
  isKey?: boolean
}

/**
 * A clickable region within a room scene. Its `type` decides what happens when
 * the player clicks it. Positions are percentages (0–100) of the scene box so
 * scenes stay responsive.
 */
export type Hotspot =
  | LookHotspot
  | ItemHotspot
  | PuzzleHotspot
  | KeyholeHotspot
  | ExitHotspot

interface HotspotBase {
  id: HotspotId
  label: string
  /** Emoji placeholder for the hotspot's appearance in the scene. */
  icon: string
  x: number
  y: number
}

/** Inspect-only: shows a description, changes nothing. */
export interface LookHotspot extends HotspotBase {
  type: 'look'
  description: string
}

/** Picking it up grants an item, then the hotspot disappears. */
export interface ItemHotspot extends HotspotBase {
  type: 'item'
  itemId: ItemId
  /** Message shown when the item is collected. */
  description: string
  /** If set, the item is hidden until this flag is true. */
  requiresFlag?: string
}

/** Opens a puzzle. (Puzzle UIs are added in a later PR.) */
export interface PuzzleHotspot extends HotspotBase {
  type: 'puzzle'
  puzzleId: PuzzleId
  description: string
}

/** A lock that accepts one specific key. Inserting it sets `placedFlag`. */
export interface KeyholeHotspot extends HotspotBase {
  type: 'keyhole'
  /** The key item that fits this hole. */
  keyItemId: ItemId
  /** Flag set once the key is inserted. */
  placedFlag: string
}

/** Moves the player to another room, optionally gated by a condition. */
export interface ExitHotspot extends HotspotBase {
  type: 'exit'
  targetRoomId: RoomId
  /** Shown when the exit is locked. */
  lockedMessage?: string
  /** Exit is locked until this flag is true. */
  requiresFlag?: string
  /** Exit is locked until all of these flags are true. */
  requiresFlags?: string[]
  /** Exit is locked until the player holds every one of these key item ids. */
  requiresKeys?: ItemId[]
  /** Reaching this exit wins the game rather than entering a room. */
  isEscape?: boolean
}

/** A single explorable location. */
export interface Room {
  id: RoomId
  name: string
  /** Flavor text shown when the player enters. */
  description: string
  /** CSS background applied to the scene (placeholder art). */
  background: string
  hotspots: Hotspot[]
}
