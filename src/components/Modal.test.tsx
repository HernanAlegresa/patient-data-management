import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title and children when open', () => {
    render(
      <Modal isOpen onClose={() => {}} title="Patient Info">
        <p>Some content</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Patient Info')).toBeInTheDocument();
    expect(screen.getByText('Some content')).toBeInTheDocument();
  });

  it('closes on X button click', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>,
    );
    await userEvent.click(screen.getByRole('button', { name: /close modal/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes on Escape key', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes when the backdrop is clicked', async () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal isOpen onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>,
    );
    await userEvent.click(container.firstChild as HTMLElement);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not close when clicking inside the dialog', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>,
    );
    await userEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('traps focus: Tab wraps from last to first focusable element', async () => {
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={() => {}} title="Test">
        <button>Alpha</button>
        <button>Beta</button>
      </Modal>,
    );
    const closeBtn = screen.getByRole('button', { name: /close modal/i });
    const betaBtn = screen.getByRole('button', { name: 'Beta' });

    betaBtn.focus();
    await user.tab();
    expect(closeBtn).toHaveFocus();
  });

  it('traps focus: Shift+Tab wraps from first to last focusable element', async () => {
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={() => {}} title="Test">
        <button>Alpha</button>
        <button>Beta</button>
      </Modal>,
    );
    const closeBtn = screen.getByRole('button', { name: /close modal/i });
    const betaBtn = screen.getByRole('button', { name: 'Beta' });

    closeBtn.focus();
    await user.tab({ shift: true });
    expect(betaBtn).toHaveFocus();
  });

  it('restores focus to the trigger element when closed', async () => {
    const user = userEvent.setup();

    function Wrapper() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open modal</button>
          <Modal isOpen={open} onClose={() => setOpen(false)} title="Test">
            <p>Content</p>
          </Modal>
        </>
      );
    }

    render(<Wrapper />);
    const trigger = screen.getByRole('button', { name: 'Open modal' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
  });
});
