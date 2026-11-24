<script setup>
import { ref } from 'vue';
import HeroSection from '@/components/home/HeroSection.vue';
import AboutSection from '@/components/home/AboutSection.vue';
import StackSection from '@/components/home/StackSection.vue';
import ExperienceSection from '@/components/home/ExperienceSection.vue';
import ProjectsSection from '@/components/home/ProjectsSection.vue';
import ToolsSection from '@/components/home/ToolsSection.vue';
import ContactSection from '@/components/home/ContactSection.vue';
import ImageLightbox from '@/components/ImageLightbox.vue';

const lightboxItem = ref(null);

const abrirLightbox = item => {
    lightboxItem.value = item;
};

const fecharLightbox = () => {
    lightboxItem.value = null;
};
</script>

<template>
    <div class="w-full">
        <HeroSection />
        <AboutSection />
        <StackSection />
        <ExperienceSection />
        <ProjectsSection @open-lightbox="abrirLightbox" />
        <ToolsSection />
        <ContactSection />

        <ImageLightbox :item="lightboxItem" @close="fecharLightbox" />
    </div>
</template>
