import { Component, ComponentInterface, ComponentWillLoad, Element, h, Host, Prop, Watch } from '@stencil/core';
import clsx from 'clsx';

@Component({
	tag: 'discord-embed-field',
	styleUrl: 'discord-embed-field.css'
})
export class DiscordEmbedField implements ComponentWillLoad, ComponentInterface {
	private validInlineIndices = new Set([1, 2, 3]);

	/**
	 * The DiscordEmbedField element
	 */
	@Element() el: HTMLElement;

	/**
	 * The field's title.
	 */
	@Prop() fieldTitle!: string;

	/**
	 * Whether this field should be displayed inline or not.
	 */
	@Prop() inline = false;

	/**
	 * The index of this inline field
	 * @remark This defines the position of this inline field. 1 is left, 2 is middle and 3 is right.
	 * @oneof [1, 2, 3]
	 * @default 1
	 */
	@Prop() inlineIndex = 1;

	@Watch('inlineIndex')
	checkInlineIndex(value: DiscordEmbedField['inlineIndex']) {
		if (!this.validInlineIndices.has(Number(value))) throw new RangeError('DiscordEmbedField `inlineIndex` prop must be one of: 1, 2, or 3');
	}

	componentWillLoad() {
		this.checkInlineIndex(this.inlineIndex);
	}

	render() {
		const parent: HTMLDiscordEmbedFieldElement = this.el.parentElement as HTMLDiscordEmbedFieldElement;

		if (parent.tagName.toLowerCase() !== 'discord-embed-fields') {
			throw new SyntaxError('All <discord-embed-field> components must be direct children of <discord-embed-fields>.');
		}

		return (
			<Host
				class={clsx(
					{
						'discord-embed-inline-field': this.inline,
						'discord-embed-inline-field-1': this.inline && this.inlineIndex === 1,
						'discord-embed-inline-field-2': this.inline && this.inlineIndex === 2,
						'discord-embed-inline-field-3': this.inline && this.inlineIndex === 3
					},
					'discord-embed-field'
				)}
			>
				<div class="discord-field-title">{this.fieldTitle}</div>
				<slot></slot>
			</Host>
		);
	}
}
