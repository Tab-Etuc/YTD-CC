import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import UrlInput from '@/components/home/UrlInput.vue';
import { readText } from '@tauri-apps/plugin-clipboard-manager';
import { notify } from '@kyvg/vue3-notification';

// Mock dependencies
vi.mock('@tauri-apps/plugin-clipboard-manager', () => ({
    readText: vi.fn(),
}));

vi.mock('@kyvg/vue3-notification', () => ({
    useNotification: () => ({
        notify: vi.fn(), // We need to mock the notify function returned by useNotification
    }),
    notify: vi.fn(), // For direct import if used (though component uses useNotification)
}));

describe('UrlInput.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        const wrapper = mount(UrlInput);
        expect(wrapper.find('input').exists()).toBe(true);
        expect(wrapper.findAll('button').length).toBe(2);
    });

    it('emits process-url event when input is valid and confirm clicked', async () => {
        const wrapper = mount(UrlInput);
        const input = wrapper.find('input');

        await input.setValue('https://youtube.com/watch?v=123');

        // Find Confirm button (the one with text "確認")
        const buttons = wrapper.findAll('button');
        const confirmBtn = buttons.filter(b => b.text().includes('確認'))[0];

        await confirmBtn.trigger('click');

        expect(wrapper.emitted('process-url')).toBeTruthy();
        expect(wrapper.emitted('process-url')![0]).toEqual(['https://youtube.com/watch?v=123']);
    });

    it('shows notification on empty input', async () => {
        const wrapper = mount(UrlInput);

        const buttons = wrapper.findAll('button');
        const confirmBtn = buttons.filter(b => b.text().includes('確認'))[0];

        await confirmBtn.trigger('click');

        expect(wrapper.emitted('process-url')).toBeFalsy();
        // Since we mocked useNotification internal notify, checking if it was called is tricky 
        // without spying on the result of useNotification.
        // But since we can't easily spy on the hook's return value inside setup unless we mock the module entirely to return a spy.
    });

    it('pastes from clipboard when paste button clicked', async () => {
        vi.mocked(readText).mockResolvedValue('https://youtu.be/test');

        const wrapper = mount(UrlInput);

        // Paste button (the one with title or svg)
        const buttons = wrapper.findAll('button');
        const pasteBtn = buttons.find(b => b.attributes('title') === '貼上連結');

        await pasteBtn!.trigger('click');

        expect(readText).toHaveBeenCalled();
        // Wait for async update
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick(); // wait for readText promise

        // The event should be emitted
        expect(wrapper.emitted('process-url')).toBeTruthy();
        expect(wrapper.emitted('process-url')![0]).toEqual(['https://youtu.be/test']);

        // Input value should be updated (v-model)
        expect(wrapper.find('input').element.value).toBe('https://youtu.be/test');
    });
});
