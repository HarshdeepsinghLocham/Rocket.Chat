import {
	Field,
	FieldGroup,
	TextInput,
	FieldLabel,
	FieldRow,
	Box,
} from '@rocket.chat/fuselage';
import { GenericModal } from '@rocket.chat/ui-client';
import { useEffect, useId } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type AddLinkComposerActionModalProps = {
	selectedText?: string;
	onConfirm: (url: string, text: string) => void;
	onClose: () => void;
};

const AddLinkComposerActionModal = ({
	selectedText,
	onClose,
	onConfirm,
}: AddLinkComposerActionModalProps) => {
	const { t } = useTranslation();
	const textField = useId();
	const urlField = useId();

	const {
		handleSubmit,
		setFocus,
		control,
	} = useForm<{
		text: string;
		url: string;
	}>({
		mode: 'onBlur',
		defaultValues: {
			text: selectedText || '',
			url: '',
		},
	});

	useEffect(() => {
		setFocus(selectedText ? 'url' : 'text');
	}, [selectedText, setFocus]);

	const normalizeUrl = (value: string) => {
		const trimmed = value.trim();

		if (!trimmed) {
			return trimmed;
		}

		return trimmed.startsWith('http://') || trimmed.startsWith('https://')
			? trimmed
			: `https://${trimmed}`;
	};

	const onClickConfirm = ({ url, text }: { url: string; text: string }) => {
		const normalizedUrl = normalizeUrl(url);
		onConfirm(normalizedUrl, text.trim());
	};

	const submit = handleSubmit(onClickConfirm);

	return (
		<GenericModal
			variant='warning'
			icon={null}
			confirmText={t('Add')}
			onCancel={onClose}
			wrapperFunction={(props) => (
				<Box is='form' onSubmit={(e) => void submit(e)} {...props} />
			)}
			title={t('Add_link')}
		>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor={textField}>{t('Text')}</FieldLabel>
					<FieldRow>
						<Controller
							control={control}
							name='text'
							render={({ field }) => (
								<TextInput
									autoComplete='off'
									id={textField}
									{...field}
								/>
							)}
						/>
					</FieldRow>
				</Field>

				<Field>
					<FieldLabel htmlFor={urlField}>{t('URL')}</FieldLabel>
					<FieldRow>
						<Controller
							control={control}
							name='url'
							rules={{
								required: t('URL_required'),
								validate: (value) => {
									const trimmed = value.trim();
									if (!trimmed) {
										return t('URL_required');
									}

									try {
										// Try parsing with protocol normalization
										new URL(
											trimmed.startsWith('http')
												? trimmed
												: `https://${trimmed}`
										);
										return true;
									} catch {
										return t('Invalid_URL');
									}
								},
							}}
							render={({ field, fieldState }) => (
								<>
									<TextInput
										autoComplete='off'
										id={urlField}
										{...field}
									/>
									{fieldState.error && (
										<Box fontScale='p2' color='danger' className='rcx-mt-4'>
											{fieldState.error.message}
										</Box>
									)}
								</>
							)}
						/>
					</FieldRow>
				</Field>
			</FieldGroup>
		</GenericModal>
	);
};

export default AddLinkComposerActionModal;