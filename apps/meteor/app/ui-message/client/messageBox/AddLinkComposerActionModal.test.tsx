import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddLinkComposerActionModal from './AddLinkComposerActionModal';

// Mock translation so t('key') returns "key"
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('AddLinkComposerActionModal', () => {
    it('shows error when URL is empty', async () => {
        const user = userEvent.setup();
        const onConfirm = jest.fn();

        render(
            <AddLinkComposerActionModal
                onConfirm={onConfirm}
                onClose={() => { }}
            />
        );

        await user.click(screen.getByRole('button', { name: /add/i }));

        expect(onConfirm).not.toHaveBeenCalled();
        expect(await screen.findByText('URL_required')).toBeInTheDocument();
    });

    it('shows error when URL is invalid', async () => {
        const user = userEvent.setup();
        const onConfirm = jest.fn();

        render(
            <AddLinkComposerActionModal
                onConfirm={onConfirm}
                onClose={() => { }}
            />
        );

        const urlInput = screen.getByLabelText(/url/i);

        await user.type(urlInput, 'abc@@@');
        await user.click(screen.getByRole('button', { name: /add/i }));

        expect(onConfirm).not.toHaveBeenCalled();
        expect(await screen.findByText('Invalid_URL')).toBeInTheDocument();
    });

    it('adds https:// when protocol is missing', async () => {
        const user = userEvent.setup();
        const onConfirm = jest.fn();

        render(
            <AddLinkComposerActionModal
                onConfirm={onConfirm}
                onClose={() => { }}
            />
        );

        const urlInput = screen.getByLabelText(/url/i);

        await user.type(urlInput, 'google.com');
        await user.click(screen.getByRole('button', { name: /add/i }));

        expect(onConfirm).toHaveBeenCalledWith(
            'https://google.com',
            expect.any(String)
        );
    });
});