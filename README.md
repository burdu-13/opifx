<p align="center">
  <img src="https://angular.dev/assets/images/press-kit/angular_wordmark_gradient.png" width="300" alt="Angular Logo">
</p>

# opifx

A simple, fast web application for atmospheric image processing. It lets you apply detailed visual effects, color grades, and stylistic filters right in your browser.

## Overview

**What it does:** opifx is an image editor focused on mood and atmosphere. You upload a photo, tweak its look using built-in presets and filters, and save the result. 

**Who it's for:** Anyone looking for a quick way to give their images a distinct, moody, or industrial-cloudy aesthetic without needing heavy desktop software. 

**The main idea:** Keep image processing entirely on the client side. No servers touching your photos, no waiting for massive file uploads. Just instant, atmospheric results.

## Features

- **Upload & preview:** Drop an image in and immediately see your changes.
- **Atmospheric presets:** Quickly apply curated looks to change the entire mood of a photo.
- **Custom filters:** Fine-tune brightness, contrast, blur, and other visual adjustments.
- **Real-time editing:** Everything updates on the screen instantly as you move the sliders.
- **Export:** Save your edited image to your device with one click.

## Architecture & Engineering

opifx is built to be clean, fast, and maintainable. We use modern Angular 21 features to keep the codebase strict and predictable.

**Smart & Dumb Components**  
We enforce a strict separation of concerns. Our UI is built with "dumb" components that only display data and emit events. All the heavy lifting, state management, and business logic live in "smart" container components and dedicated services.

**Strict Signals**  
We use Angular Signals as our primary reactivity model. This gives us a highly predictable state flow, eliminating complex reactive chains, unnecessary RxJS subscriptions, and side effects. 

**The Processing Engine**  
The actual image processing works through a combination of HTML Canvas and CSS filters. This allows us to apply complex visual adjustments instantly in the browser without server round-trips.

## Tech Stack

- **Angular 21:** The core framework driving the application.
- **Signals:** For fast, predictable state management.
- **HTML Canvas & CSS Filters:** The engines doing the actual image processing and visual rendering.

## Project Structure

Here is a quick overview of how the code is organized:

- `src/app/core/` - Global services, state management, and base setups.
- `src/app/features/editor/` - The main editing workspace. This handles the upload, the active editing view, and the export logic.
- `src/app/shared/` - Reusable UI components (like buttons, sliders, and navigation elements), plus configuration files like our filter presets.

## Usage

Using opifx is built to be a straightforward three-step process:

1. **Upload:** Drag and drop an image file onto the start screen, or click to browse your files.
2. **Edit:** Select a preset to get a baseline look. Then, use the manual controls to adjust specific filters until the image feels right.
3. **Export:** Click the download button. The canvas will capture your exact preview and save it to your device as a standard image file.
