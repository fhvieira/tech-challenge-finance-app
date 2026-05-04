import type { Meta, StoryObj } from '@storybook/react';
import BalanceCard from './BalanceCard';

const meta: Meta<typeof BalanceCard> = {
  title: 'Dashboard/BalanceCard',
  component: BalanceCard,
};

export default meta;

type Story = StoryObj<typeof BalanceCard>;

export const Default: Story = {
  args: {
    balance: 1250,
  },
};

export const NegativeBalance: Story = {
  args: {
    balance: -300,
  },
};