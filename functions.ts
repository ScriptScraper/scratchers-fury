function playerPhysics() {
    playerSprite.setPosition(makeCodeMan.x, makeCodeMan.y)
    playerSprite.z = makeCodeMan.y
    for (let sprite of sprites.allOfKind(SpriteKind.Punch)) {
        let punch = sprite as Punch
        punch.setPosition(makeCodeMan.x + punch.xOffset, makeCodeMan.y + punch.yOffset)
    }
    if (Math.abs(makeCodeMan.vx) <= 160) {
        if (controller.left.isPressed()) {
            makeCodeMan.vx -= 20
        } else if (controller.right.isPressed()) {
            makeCodeMan.vx += 20
        }
    }
    if (Math.abs(makeCodeMan.vy) <= 160) {
        if (controller.up.isPressed()) {
            makeCodeMan.vy -= 20
        } else if (controller.down.isPressed()) {
            makeCodeMan.vy += 20
        }
    }
}

function aimHands() {
    leftHand.setPosition(makeCodeMan.x, makeCodeMan.y)
    rightHand.setPosition(makeCodeMan.x, makeCodeMan.y)
    spriteFx.setRotation(leftHand, angle)
    spriteFx.setRotation(rightHand, angle)
    if (angle >= 90 || angle < -90) {
        leftHand.z = playerSprite.z - 1
        rightHand.z = playerSprite.z + 1
    } else {
        leftHand.z = playerSprite.z + 1
        rightHand.z = playerSprite.z - 1
    }
}

function attacks() {
    if (browserEvents.MouseLeft.isPressed() && currentPunchDelay <= 0) {
        switch (melee) {
            case meleeAttacks.normal: let newPunch = new DefaultPunch; break
            case meleeAttacks.ironFist: newPunch = new IronFist; break
            case meleeAttacks.thunderclap: newPunch = new Thunderclap; break
            case meleeAttacks.needleArm: newPunch = new NeedleArm; break
            case meleeAttacks.explodeOPunch: newPunch = new ExplodeOPunch; break
            case meleeAttacks.clusterBlast: newPunch = new ClusterBlast; break
            case meleeAttacks.bombBarrage: newPunch = new BombBarrage; break
        }
        currentPunchDelay = punchAtkDelay
    } else if (currentPunchDelay >= 0) {
        currentPunchDelay -= 1
    }

    if (browserEvents.MouseRight.isPressed() && currentLaserDelay <= 0) {
        switch (ranged) {
            case rangedAttacks.normal: let newLaser = new DefaultLaser; break
            case rangedAttacks.unibeam: newLaser = new Unibeam; break
            case rangedAttacks.railgun: newLaser = new Railgun; break
            case rangedAttacks.incineration:
                for (let sprite of sprites.allOfKind(SpriteKind.Projectile)) {
                    let laser = sprite as Laser
                    laser.alreadyHit.splice(0, laser.alreadyHit.length)
                }
                break
        }
        let laserEffect = sprites.create(img`
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
            ................................
        `, SpriteKind.Null)
        laserEffect.setPosition(makeCodeMan.x, makeCodeMan.y - 8)
        laserEffect.z = makeCodeMan.y + 1
        laserEffect.lifespan = 190
        control.runInParallel(function () {
            for (let image of assets.animation`laserPulse`) {
                laserEffect.setImage(image)
                spriteFx.cloneSpriteImage(laserEffect, laserEffect)
                spriteFx.setRotation(laserEffect, angle)
                pause(45)
            }
        })
        currentLaserDelay = laserAtkDelay
    } else if (currentLaserDelay >= 0) {
        currentLaserDelay -= 1
    }
}

function startWave() {
    waveBeaten = false
    wave += 1
    enemies = []
    spawnTimer -= 1
    spawnCount += 0.2

    globalHealthBoost += 2
    globalKbBoost += 0.01

    normalCount += 2
    fastCount += 1.5
    projCount += 0.5
    tankyNormalCount += 1
    tankyFastCount += 0.5
    tankyProjCount += 1

    if (normalCount > 0) {
        for (let i = 0; i < Math.round(normalCount); i++) {
            enemies.push(enemyTypes.normal)
        }
    }
    if (fastCount > 0) {
        for (let i = 0; i < Math.round(fastCount); i++) {
            enemies.push(enemyTypes.fast)
        }
    }
    if (projCount > 0) {
        for (let i = 0; i < Math.round(projCount); i++) {
            enemies.push(enemyTypes.proj)
        }
    }
    if (tankyNormalCount > 0) {
        for (let i = 0; i < Math.round(tankyNormalCount); i++) {
            enemies.push(enemyTypes.tankyNormal)
        }
    }
    if (tankyFastCount > 0) {
        for (let i = 0; i < Math.round(tankyFastCount); i++) {
            enemies.push(enemyTypes.tankyFast)
        }
    }
    if (tankyProjCount > 0) {
        for (let i = 0; i < Math.round(tankyProjCount); i++) {
            enemies.push(enemyTypes.tankyProj)
        }
    }
}

function endWave() {
    if (wave % 5 == 0) {
        let upgrades = upgradePollEpic.slice()
        if (melee == 0) { upgrades.splice(upgrades.indexOf(7), 6); upgrades.splice(upgrades.indexOf(10), 6) }
        else if (melee == 1) { upgrades.splice(upgrades.indexOf(6), 3); upgrades.splice(upgrades.indexOf(9), 9) }
        else if (melee == 4) { upgrades.splice(upgrades.indexOf(9), 3); upgrades.splice(upgrades.indexOf(6), 9) }
        else { upgrades.splice(upgrades.indexOf(7), 18)}
        if (ranged == 0) { upgrades.splice(upgrades.indexOf(13), 6) }
        else if (ranged == 1) { upgrades.splice(upgrades.indexOf(12), 6) }
        else { upgrades.splice(upgrades.indexOf(12), 12) }
        let newUpgrade: Sprite = sprites.create(img`.`, SpriteKind.Null)
        newUpgrade.lifespan = 50
        for (let i = 1; i <= 3; i++) {
            let randomIndex = randint(0, upgrades.length - 1)
            let upgrade = upgrades[randomIndex]
            while (upgrades.indexOf(upgrade) != -1) {
                upgrades.splice(upgrades.indexOf(upgrade), 1)
            }
            switch (upgrade) {
                case 0: let newUpgrade = new Upgrade(18, 0, 0, 0, 0, 0, 0, melee, ranged, i * 85 - 42,
                    "Mega Muscle: punches do significantly more damage!", assets.image`meleeBuffIcon`); break
                case 1: newUpgrade = new Upgrade(0, 9, 0, 0, 0, 0, 0, melee, ranged, i * 85 - 42,
                    "Supersonic: massively increases punch attack speed!", assets.image`meleeBuffIcon`); break
                case 2: newUpgrade = new Upgrade(0, 0, 0, 18, 0, 0, 0, melee, ranged, i * 85 - 42,
                    "Scorch the Sun: lasers do much more damage!", assets.image`rangedBuffIcon`); break
                case 3: newUpgrade = new Upgrade(0, 0, 0, 0, 9, 0, 0, melee, ranged, i * 85 - 42,
                    "Full-Auto: lasers fire way faster!", assets.image`rangedBuffIcon`); break
                case 4: newUpgrade = new Upgrade(0, 0, 30, 0, 0, 30, 0, melee, ranged, i * 85 - 42,
                    "Hyperdensity: all attacks have much more knockback!",assets.image`bothBuffIcon`); break
                case 5: newUpgrade = new Upgrade(0, 0, 0, 0, 0, 0, 3, melee, ranged, i * 85 - 42,
                    "Full Jigsaw: increase max health by 3, and heal 6!", assets.image`healthBuffIcon`); break
                case 6: newUpgrade = new Upgrade(0, -6, 0, 0, 0, 0, 0, meleeAttacks.ironFist, ranged, i * 85 - 42,
                    "IronFist: gain heavier, harder hitting punches at a slower attack speed.", assets.image`ironFistIcon`); break
                case 7: newUpgrade = new Upgrade(0, -6, 0, 0, 0, 0, 0, meleeAttacks.thunderclap, ranged, i * 85 - 42,
                    "Thunderclap: gain a clap attack with huge damage and less attack speed.",assets.image`thunderclapIcon`); break
                case 8: newUpgrade = new Upgrade(0, 0, 0, 0, 0, 0, 0, meleeAttacks.needleArm, ranged, i * 85 - 42,
                    "Needle Arm: gain a sharp jab attack with huge range and more damage.",assets.image`needleArmIcon`); break
                case 9: newUpgrade = new Upgrade(0, 0, 0, 0, 0, 0, 0, meleeAttacks.explodeOPunch, ranged, i * 85 - 42,
                    "ExplodeOPunch: gain a 50% chance to explode when punching an enemy.", assets.image`explodeOPunchIcon`); break
                case 10: newUpgrade = new Upgrade(0, 0, 0, 0, 0, 0, 0, meleeAttacks.clusterBlast, ranged, i * 85 - 42,
                    "Cluster Blast: explosions split into many cluster bombs.",assets.image`clusterBlastIcon`); break
                case 11: newUpgrade = new Upgrade(0, 15, 0, 0, 0, 0, 0, meleeAttacks.bombBarrage, ranged, i * 85 - 42,
                    "Bomb Barrage: unleash a rapid fury of smaller explosive punches.",assets.image`bombBarrageIcon`); break
                case 12: newUpgrade = new Upgrade(0, 0, 0, 0, 0, 0, 0, melee, rangedAttacks.unibeam, i * 85 - 42,
                    "Unibeam: Shoot one large laser that has high damage and can pierce.",assets.image`unibeamIcon`); break
                case 13: newUpgrade = new Upgrade(0, 0, 0, 0, -12, 0, 0, melee, rangedAttacks.railgun, i * 85 - 42,
                    "Railgun: Shoot a massive ray with insane damage at a much slower rate.", assets.image`railgunIcon`); break
                case 14: newUpgrade = new Upgrade(0, 0, 0, 0, 18, 0, 0, melee, rangedAttacks.incineration, i * 85 - 42,
                    "Incineration: Shoot a continuous laser that rapidly hits enemies.",assets.image`incinerationIcon`); break
            }
        }
    } else {
        let upgrades = upgradePoolNormal.slice()
        let newUpgrade: Sprite = sprites.create(img`.`, SpriteKind.Null)
        newUpgrade.lifespan = 50
        for (let i = 1; i <= 3; i++) {
            let randomIndex = randint(0, upgrades.length - 1)
            let upgrade = upgrades[randomIndex]
            upgrades.splice(randomIndex, 1)
            switch (upgrade) {
                case 0: let newUpgrade = new Upgrade(6, 0, 0, 0, 0, 0, 0, melee, ranged, i * 85 - 42,
                    "Strength: punches deal more damage.", assets.image`meleeBuffIcon`); break
                case 1: newUpgrade = new Upgrade(0, 3, 0, 0, 0, 0, 0, melee, ranged, i * 85 - 42,
                    "Rage: increases punch attack speed.", assets.image`meleeBuffIcon`); break
                case 2: newUpgrade = new Upgrade(0, 0, 10, 0, 0, 0, 0, melee, ranged, i * 85 - 42,
                    "Heavy Hit: punches have more knockback.", assets.image`meleeBuffIcon`); break
                case 3: newUpgrade = new Upgrade(0, 0, 0, 6, 0, 0, 0, melee, ranged, i * 85 - 42,
                    "Focused Beams: lasers deal more damage", assets.image`rangedBuffIcon`); break
                case 4: newUpgrade = new Upgrade(0, 0, 0, 0, 3, 0, 0, melee, ranged, i * 85 - 42,
                    "Happy Trigger: lasers fire faster.", assets.image`rangedBuffIcon`); break
                case 5: newUpgrade = new Upgrade(0, 0, 0, 0, 0, 10, 0, melee, ranged, i * 85 - 42,
                    "Dense Light: lasers have more knockback.", assets.image`rangedBuffIcon`); break
                case 6: newUpgrade = new Upgrade(0, 0, 0, 0, 0, 0, 1, melee, ranged, i * 85 - 42,
                    "Piece of the Puzzle: increase max health by 1 and heal 2.", assets.image`healthBuffIcon`); break
            }
        }
    }
    
}

function animationPlayer(frames:Image[]) {
    animation.runImageAnimation(playerSprite, frames, 125, true)
    currentAnimation = frames
}

function playerAnimations() {
    if (makeCodeMan.vx == 0 && makeCodeMan.vy == 0) {
        if (angle > 90 && angle <= 180) {
            if (currentAnimation != animations[animationState.idleL1]) { animationPlayer(animations[animationState.idleL1]) }
        } else if (angle > -180 && angle <= -90) {
            if (currentAnimation != animations[animationState.idleL2]) { animationPlayer(animations[animationState.idleL2]) }
        } else if (angle > -90 && angle <= 0) {
            if (currentAnimation != animations[animationState.idleR2]) { animationPlayer(animations[animationState.idleR2]) }
        } else if (angle > 0 && angle <= 90) {
            if (currentAnimation != animations[animationState.idleR1]) { animationPlayer(animations[animationState.idleR1]) }
        }
    } else if (makeCodeMan.vx == 0 && makeCodeMan.vy != 0) {
        if (angle > 90 && angle <= 180) {
            if (currentAnimation != animations[animationState.moveL1a]) { animationPlayer(animations[animationState.moveL1a]) }
        } else if (angle > -180 && angle <= -90) {
            if (currentAnimation != animations[animationState.moveL2a]) { animationPlayer(animations[animationState.moveL2a]) }
        } else if (angle > -90 && angle <= 0) {
            if (currentAnimation != animations[animationState.moveR2b]) { animationPlayer(animations[animationState.moveR2b]) }
        } else if (angle > 0 && angle <= 90) {
            if (currentAnimation != animations[animationState.moveR1b]) { animationPlayer(animations[animationState.moveR1b]) }
        }
    } else if (makeCodeMan.vx < 0) {
        if (angle > 90 && angle <= 180) {
            if (currentAnimation != animations[animationState.moveL1a]) { animationPlayer(animations[animationState.moveL1a]) }
        } else if (angle > -180 && angle <= -90) {
            if (currentAnimation != animations[animationState.moveL2a]) { animationPlayer(animations[animationState.moveL2a]) }
        } else if (angle > -90 && angle <= 0) {
            if (currentAnimation != animations[animationState.moveR2a]) { animationPlayer(animations[animationState.moveR2a]) }
        } else if (angle > 0 && angle <= 90) {
            if (currentAnimation != animations[animationState.moveR1a]) { animationPlayer(animations[animationState.moveR1a]) }
        }
    } else if (makeCodeMan.vx > 0) {
        if (angle > 90 && angle <= 180) {
            if (currentAnimation != animations[animationState.moveL1b]) { animationPlayer(animations[animationState.moveL1b]) }
        } else if (angle > -180 && angle <= -90) {
            if (currentAnimation != animations[animationState.moveL2b]) { animationPlayer(animations[animationState.moveL2b]) }
        } else if (angle > -90 && angle <= 0) {
            if (currentAnimation != animations[animationState.moveR2b]) { animationPlayer(animations[animationState.moveR2b]) }
        } else if (angle > 0 && angle <= 90) {
            if (currentAnimation != animations[animationState.moveR1b]) { animationPlayer(animations[animationState.moveR1b]) }
        }
    }
}