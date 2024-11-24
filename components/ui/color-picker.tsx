'use client';

import { swatches } from '@/libs/helpers/color-generator';
import { ColorPicker, ColorSwatch, Menu } from '@mantine/core';
import { useState } from 'react';

interface IDSColorPicker {
  color?: string;
  onClose?: (color: string) => void;
  onChange?: (color: string) => void;
}

export default function DSColorPicker(props: Readonly<IDSColorPicker>) {
  const [color, setColor] = useState<string | undefined>(props.color);

  const handleOnClose = () => {
    props.onClose?.(color!);
  };

  const handleOnChange = (color: string) => {
    setColor(color);
    props.onChange?.(color);
  };

  return (
    <Menu onClose={handleOnClose}>
      <Menu.Target>
        <ColorSwatch size={20} className="cursor-pointer" color={color ?? ''} />
      </Menu.Target>
      <Menu.Dropdown>
        <ColorPicker onChange={color => handleOnChange(color)} swatches={swatches} />
      </Menu.Dropdown>
    </Menu>
  );
}
