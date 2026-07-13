import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { useMemo, useState } from 'react';
import type { ComponentProps } from 'react';
import { TilePattern } from './TilePattern';
import type {
  TilePatternColor,
  TilePatternTile,
  TilePatternType,
} from './TilePattern';

type TilePatternStoryArgs = ComponentProps<typeof TilePattern> & {
  columns?: number;
  rows?: number;
};

type TileOverride = {
  color: TilePatternColor | 'inherit';
  type: TilePatternType | 'empty';
};

type TileOverrideMap = Record<string, TileOverride>;

const defaultTiles: TilePatternTile[][] = [
  [1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 18, 19],
];

const smallTiles: TilePatternTile[][] = [
  [3, { type: 9, color: 'white' }],
];

const tileTypeOptions = Array.from(
  { length: 22 },
  (_, index) => (index + 1) as TilePatternType,
);

const colorOptions: Array<TilePatternColor | 'inherit'> = [
  'inherit',
  'brand',
  'accent',
  'accent-light',
  'white',
  'transparent',
];

const usageExample = `import { TilePattern } from '@ourfuturehealth/react-components';

<TilePattern
  color="brand"
  tiles={[
    [1, 2, null],
    [7, { type: 8, color: 'white' }, 9],
  ]}
/>;
`;

const getTileKey = (rowIndex: number, columnIndex: number) =>
  `${rowIndex}-${columnIndex}`;

const normaliseBuilderCount = (value: number | undefined) =>
  Math.max(1, Math.floor(Number(value) || 1));

const getDefaultTileType = (tileIndex: number) =>
  tileTypeOptions[tileIndex % tileTypeOptions.length];

const getBuilderTile = (
  tileIndex: number,
  override: TileOverride | undefined,
): TilePatternTile => {
  const type = override?.type ?? getDefaultTileType(tileIndex);

  if (type === 'empty') {
    return null;
  }

  if (!override || override.color === 'inherit') {
    return type;
  }

  return {
    type,
    color: override.color,
  };
};

const buildBuilderTiles = (
  rows: number,
  columns: number,
  overrides: TileOverrideMap,
) =>
  Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: columns }, (_, columnIndex) => {
      const tileIndex = rowIndex * columns + columnIndex;

      return getBuilderTile(
        tileIndex,
        overrides[getTileKey(rowIndex, columnIndex)],
      );
    }),
  );

const serialiseTile = (tile: TilePatternTile) => {
  if (tile === null) {
    return 'null';
  }

  if (typeof tile === 'number') {
    return String(tile);
  }

  return `{ type: ${tile.type}, color: '${tile.color}' }`;
};

const buildTilePatternCode = (
  tiles: TilePatternTile[][],
  color: TilePatternColor,
  tileSize: string,
) => {
  const rows = tiles
    .map((row) => `    [${row.map(serialiseTile).join(', ')}],`)
    .join('\n');

  return `<TilePattern
  color="${color}"
  tileSize="${tileSize}"
  tiles={[
${rows}
  ]}
/>`;
};

const TilePatternBuilderPreview = ({
  color = 'brand',
  columns = 4,
  rows = 2,
  tileSize = '80px',
}: TilePatternStoryArgs) => {
  const [overrides, setOverrides] = useState<TileOverrideMap>({});
  const rowCount = normaliseBuilderCount(rows);
  const columnCount = normaliseBuilderCount(columns);
  const tiles = useMemo(
    () => buildBuilderTiles(rowCount, columnCount, overrides),
    [columnCount, overrides, rowCount],
  );
  const generatedCode = buildTilePatternCode(tiles, color, tileSize);

  const updateOverride = (
    rowIndex: number,
    columnIndex: number,
    nextOverride: TileOverride,
  ) => {
    const key = getTileKey(rowIndex, columnIndex);
    const defaultType = getDefaultTileType(rowIndex * columnCount + columnIndex);

    setOverrides((currentOverrides) => {
      const nextOverrides = { ...currentOverrides };

      if (
        nextOverride.type === defaultType &&
        nextOverride.color === 'inherit'
      ) {
        delete nextOverrides[key];
      } else {
        nextOverrides[key] = nextOverride;
      }

      return nextOverrides;
    });
  };

  return (
    <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '100%' }}>
      <TilePattern color={color} tileSize={tileSize} tiles={tiles} />

      <div
        style={{
          display: 'grid',
          gap: '0.75rem',
          gridTemplateColumns: `repeat(${columnCount}, minmax(8rem, 1fr))`,
          overflowX: 'auto',
        }}
      >
        {tiles.flatMap((row, rowIndex) =>
          row.map((_tile, columnIndex) => {
            const key = getTileKey(rowIndex, columnIndex);
            const tileIndex = rowIndex * columnCount + columnIndex;
            const defaultType = getDefaultTileType(tileIndex);
            const override = overrides[key] ?? {
              type: defaultType,
              color: 'inherit',
            };

            return (
              <fieldset
                key={key}
                style={{
                  border: '1px solid #d8dde0',
                  display: 'grid',
                  gap: '0.5rem',
                  margin: 0,
                  padding: '0.75rem',
                }}
              >
                <legend>Tile {tileIndex + 1}</legend>

                <label>
                  Type
                  <select
                    value={override.type}
                    onChange={(event) => {
                      const nextType =
                        event.target.value === 'empty'
                          ? 'empty'
                          : (Number(event.target.value) as TilePatternType);

                      updateOverride(rowIndex, columnIndex, {
                        ...override,
                        type: nextType,
                      });
                    }}
                  >
                    <option value="empty">Empty</option>
                    {tileTypeOptions.map((tileType) => (
                      <option key={tileType} value={tileType}>
                        {tileType}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Color
                  <select
                    value={override.color}
                    onChange={(event) => {
                      updateOverride(rowIndex, columnIndex, {
                        ...override,
                        color: event.target.value as TileOverride['color'],
                      });
                    }}
                  >
                    {colorOptions.map((tileColor) => (
                      <option key={tileColor} value={tileColor}>
                        {tileColor}
                      </option>
                    ))}
                  </select>
                </label>
              </fieldset>
            );
          }),
        )}
      </div>

      <pre
        style={{
          margin: 0,
          maxWidth: '100%',
          overflowX: 'auto',
          padding: '1rem',
          whiteSpace: 'pre',
        }}
      >
        <code>{generatedCode}</code>
      </pre>
    </div>
  );
};

const meta = {
  title: 'Primitives/TilePattern',
  component: TilePattern,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Use TilePattern as a decorative primitive inside other components. It does not render a default matrix; pass the exact tile rows and columns needed by the consuming component.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Use <code>TilePattern</code> only as decorative component chrome.
            Pass a two-dimensional <code>tiles</code> matrix. Use Figma tile
            numbers <code>1</code> to <code>22</code>, and use{' '}
            <code>null</code> for an empty tile.
          </p>
          <p>
            Use <code>accent</code> and <code>accent-light</code> when the
            pattern should follow the active participant or research theme.
            Use <code>brand</code>, <code>white</code>, or{' '}
            <code>transparent</code> for fixed colours.
          </p>
          <p>
            The Builder story adds Storybook-only <code>rows</code> and{' '}
            <code>columns</code> controls, plus per-tile controls in the
            preview canvas, so you can generate a matrix before copying it into
            production code.
          </p>
          <Source code={usageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes of={Default} />

          <Stories title="Examples" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    tiles: {
      control: false,
      description:
        'Required two-dimensional matrix of Figma tile types. Use `null` for an empty/off tile.',
      table: {
        category: 'TilePatternProps',
      },
    },
    color: {
      control: 'radio',
      options: ['brand', 'accent', 'accent-light', 'white', 'transparent'],
      description:
        'Default colour for every tile. `accent` and `accent-light` follow the active participant or research theme; individual tile objects can override this with their own `color`.',
      table: {
        category: 'TilePatternProps',
      },
    },
    tileSize: {
      control: 'text',
      description:
        'CSS length for each square tile. Defaults to `120px`.',
      table: {
        category: 'TilePatternProps',
      },
    },
    rows: {
      control: {
        min: 1,
        step: 1,
        type: 'number',
      },
      description:
        'Storybook-only Builder control. Sets how many rows to generate in the preview matrix.',
      table: {
        category: 'Builder story only',
      },
    },
    columns: {
      control: {
        min: 1,
        step: 1,
        type: 'number',
      },
      description:
        'Storybook-only Builder control. Sets how many columns to generate in the preview matrix.',
      table: {
        category: 'Builder story only',
      },
    },
    className: {
      control: false,
      description:
        'Optional extra classes applied to the tile-pattern container.',
      table: {
        category: 'Advanced',
      },
    },
  },
  args: {
    color: 'brand',
    tileSize: '120px',
    tiles: defaultTiles,
  },
} satisfies Meta<TilePatternStoryArgs>;

export default meta;

type Story = StoryObj<TilePatternStoryArgs>;

export const Default: Story = {
  parameters: {
    controls: { disable: true },
  },
};

export const Builder: Story = {
  args: {
    columns: 4,
    color: 'brand',
    rows: 2,
    tileSize: '80px',
  },
  render: (args) => <TilePatternBuilderPreview {...args} />,
  parameters: {
    controls: {
      include: ['rows', 'columns', 'color', 'tileSize'],
    },
    docs: {
      description: {
        story:
          'Use the Builder story to generate rows and columns, then override individual tile types and colours in the canvas before copying the generated matrix.',
      },
    },
  },
};

export const SmallTileSize: Story = {
  args: {
    color: 'brand',
    tileSize: '40px',
    tiles: smallTiles,
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Small pattern proving the primitive can support compact component chrome such as Counter.',
      },
    },
  },
};
