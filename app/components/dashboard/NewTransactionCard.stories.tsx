import type { Meta, StoryObj } from '@storybook/react';
import NewTransactionCard from './NewTransactionCard';

const meta: Meta<typeof NewTransactionCard> = {
  title: 'Dashboard/NewTransactionCard',
  component: NewTransactionCard,
};

export default meta;

type Story = StoryObj<typeof NewTransactionCard>;

export const Default: Story = {
  args: {
    onAdd: () => {},
    onUpdate: () => {},
    onCancelEdit: () => {},
    editingTransaction: null,
  },
};