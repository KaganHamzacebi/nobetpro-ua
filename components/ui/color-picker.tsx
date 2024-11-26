'use client';

import { swatches } from '@/libs/helpers/color-generator';
import { ColorPicker, ColorSwatch, Menu } from '@mantine/core';
import { useCallback, useState } from 'react';

interface IDSColorPicker {
  color: string | null;
  onClose?: (color: string) => void;
  onChange?: (color: string) => void;
}

export default function DSColorPicker({
  color: initialColor,
  onClose,
  onChange
}: Readonly<IDSColorPicker>) {
  const [color, setColor] = useState<string | null>(initialColor);

  const handleOnClose = useCallback(() => {
    onClose?.(color ?? '');
  }, [color, onClose]);

  const handleOnChange = useCallback(
    (color: string) => {
      setColor(color);
      onChange?.(color);
    },
    [onChange]
  );

  return (
    <Menu onClose={handleOnClose}>
      <Menu.Target>
        <ColorSwatch size={20} className="cursor-pointer" color={color ?? ''} />
      </Menu.Target>
      <Menu.Dropdown>
        <ColorPicker
          onChange={color => handleOnChange(color)}
          swatches={swatches}
          value={color ?? undefined}
        />
      </Menu.Dropdown>
    </Menu>
  );
}
