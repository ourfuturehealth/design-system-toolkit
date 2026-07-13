import bundledTilePatternSprite from '@ourfuturehealth/toolkit/assets/tile-pattern/tile-pattern-sprite.svg?raw';
import type React from 'react';
import { joinClasses } from '../../internal/ofhUtils';

export type TilePatternColor =
  | 'brand'
  | 'accent'
  | 'accent-light'
  | 'white'
  | 'transparent';

export type TilePatternType =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22;

export type TilePatternTile =
  | TilePatternType
  | {
      type: TilePatternType;
      color?: TilePatternColor;
    }
  | null;

export interface TilePatternProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'children' | 'color' | 'dangerouslySetInnerHTML'
  > {
  tiles: TilePatternTile[][];
  color?: TilePatternColor;
  tileSize?: string;
  ref?: React.Ref<HTMLDivElement>;
}

type TilePatternSymbol = {
  body: string;
  viewBox: string;
};

const bundledTilePatternSymbols = new Map<number, TilePatternSymbol>(
  Array.from(
    bundledTilePatternSprite.matchAll(
      /<symbol\b([^>]*)>([\s\S]*?)<\/symbol>/g,
    ),
    ([, attributes, body]) => {
      const idMatch = attributes.match(/\bid="ofh-tile-pattern-(\d+)"/);
      const viewBoxMatch = attributes.match(/\bviewBox="([^"]+)"/);

      if (!idMatch || !viewBoxMatch) {
        return null;
      }

      return [
        Number(idMatch[1]),
        { body, viewBox: viewBoxMatch[1] },
      ] as const;
    },
  ).filter(
    (
      symbol,
    ): symbol is readonly [number, TilePatternSymbol] => symbol !== null,
  ),
);

const getTilePatternType = (tile: Exclude<TilePatternTile, null>) =>
  typeof tile === 'number' ? tile : tile.type;

const getTilePatternColor = (
  tile: Exclude<TilePatternTile, null>,
  inheritedColor: TilePatternColor,
) => (typeof tile === 'number' ? inheritedColor : (tile.color ?? inheritedColor));

export const TilePattern = ({
  tiles,
  color = 'brand',
  tileSize = '120px',
  className = '',
  style,
  ref,
  ...props
}: TilePatternProps) => {
  const columnCount = tiles[0]?.length ?? 0;

  if (!tiles.length || columnCount === 0) {
    return null;
  }

  const patternStyle = {
    '--ofh-tile-pattern-columns': String(columnCount),
    '--ofh-tile-pattern-tile-size': tileSize,
    ...(style as React.CSSProperties | undefined),
  } as React.CSSProperties;

  return (
    <div
      {...props}
      ref={ref}
      className={joinClasses(
        'ofh-tile-pattern',
        `ofh-tile-pattern--color-${color}`,
        className,
      )}
      aria-hidden="true"
      style={patternStyle}
    >
      {tiles.flatMap((row, rowIndex) =>
        row.map((tile, columnIndex) => {
          const key = `${rowIndex}-${columnIndex}`;

          if (tile === null) {
            return (
              <span
                key={key}
                className="ofh-tile-pattern__tile ofh-tile-pattern__tile--empty"
              />
            );
          }

          const tileType = getTilePatternType(tile);
          const tileColor = getTilePatternColor(tile, color);
          const symbol = bundledTilePatternSymbols.get(tileType);

          return (
            <span
              key={key}
              className={joinClasses(
                'ofh-tile-pattern__tile',
                `ofh-tile-pattern__tile--color-${tileColor}`,
              )}
              data-ofh-tile-pattern-type={tileType}
            >
              {symbol ? (
                <svg
                  className="ofh-tile-pattern__svg"
                  viewBox={symbol.viewBox}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <g dangerouslySetInnerHTML={{ __html: symbol.body }}></g>
                </svg>
              ) : null}
            </span>
          );
        }),
      )}
    </div>
  );
};

TilePattern.displayName = 'TilePattern';
