//The main events that will run the game will go here
game.onUpdate (function() {
    angle = spriteutils.radiansToDegrees(spriteutils.angleFrom(makeCodeMan, cursor))
    playerPhysics()
    aimHands()
    playerAnimations()
    attacks()

    for (let sprite of sprites.allOfKind(SpriteKind.Projectile)) {
        let laser = sprite as Laser
        laser.behavior()
    }
    for (let sprite of sprites.allOfKind(SpriteKind.Enemy)) {
        if (sprite instanceof Enemy) {
            let enemy = sprite as Enemy
            enemy.behavior()
        }
    }
    
    if (spawnTimer <= 0) {
        if (enemies.length > 0) {
            for (let i = 0; i < Math.round(spawnCount); i++) {
                let randomIndex = randint(0, enemies.length - 1)
                let enemy = enemies[randomIndex]
                enemies.removeAt(randomIndex)
                if (enemy == enemyTypes.normal) {
                    let newEnemy = new NormalEnemy
                } else if (enemy == enemyTypes.fast) {
                    let newEnemy = new FastEnemy
                } else if (enemy == enemyTypes.proj) {
                    let newEnemy = new ProjEnemy
                } else if (enemy == enemyTypes.tankyNormal) {
                    let newEnemy = new NormalEnemy
                } else if (enemy == enemyTypes.tankyFast) {
                    let newEnemy = new NormalEnemy
                } else if (enemy == enemyTypes.tankyProj) {
                    let newEnemy = new NormalEnemy
                }
            spawnTimer = spawnTimerMax
            }
        } else if (!waveBeaten && sprites.allOfKind(SpriteKind.Enemy).length == 0) {
            waveBeaten = true
            endWave()
        }
    } else {
        spawnTimer -= 1
    }
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function(sprite: Sprite, otherSprite: Sprite) {
    hp -= 1
    if (hp <= 0) {
        game.setGameOverMessage(true, "It's over for MakeCode Man...")
        game.gameOver(false)
    }
    healthBar[hp].setImage(assets.image`healthEmpty`)
    sprite.setFlag(SpriteFlag.Ghost, true)
    spriteutils.setVelocityAtAngle(makeCodeMan, spriteutils.angleFrom(otherSprite, sprite), 200)
    control.runInParallel(function() {
        for (let i = 0; i < 12; i++) {
            playerSprite.setFlag(SpriteFlag.Invisible, true)
            leftHand.setFlag(SpriteFlag.Invisible, true)
            rightHand.setFlag(SpriteFlag.Invisible, true)
            pause(50)
            playerSprite.setFlag(SpriteFlag.Invisible, false)
            leftHand.setFlag(SpriteFlag.Invisible, false)
            rightHand.setFlag(SpriteFlag.Invisible, false)
            pause(50)
        }
        sprite.setFlag(SpriteFlag.Ghost, false)
    })
})

sprites.onOverlap(SpriteKind.Punch, SpriteKind.Enemy, function(sprite: Sprite, otherSprite: Sprite) {
    if (!(otherSprite instanceof Enemy)) { return }
    let attack = sprite as Punch
    let enemy = otherSprite as Enemy
    if (attack.alreadyHit.indexOf(enemy) == -1) {
        attack.alreadyHit.push(enemy)
        enemy.hit(attack.damage, attack.knockback, spriteutils.angleFrom(sprite, otherSprite))
        if (!attack.hitFirst) {
            attack.hitFirst = true
            attack.effect(otherSprite)
        }
    }
})

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function(sprite: Sprite, otherSprite: Sprite) {
    if (!(otherSprite instanceof Enemy)) { return }
    let attack = sprite as Laser
    let enemy = otherSprite as Enemy
    if (attack.alreadyHit.indexOf(enemy) == -1) {
        attack.alreadyHit.push(enemy)
        enemy.hit(attack.damage, attack.knockback, spriteutils.angleFrom(sprite, otherSprite))
        if (attack.pierceCount > 0) {
            attack.pierceCount -= 1
        } else {
            sprites.destroy(attack)
        }
        attack.effect(otherSprite)
    }
})

sprites.onOverlap(SpriteKind.Explosion, SpriteKind.Enemy, function (sprite: Sprite, otherSprite: Sprite) {
    if (!(otherSprite instanceof Enemy)) { return }
    let attack = sprite as Explosion
    let enemy = otherSprite as Enemy
    if (attack.alreadyHit.indexOf(enemy) == -1) {
        attack.alreadyHit.push(enemy)
        enemy.hit(attack.damage, attack.knockback, spriteutils.angleFrom(sprite, otherSprite))
    }
})

sprites.onOverlap(SpriteKind.Food, SpriteKind.Upgrade, function (sprite: Sprite, otherSprite: Sprite) {
    let currentUpgrade = otherSprite as Upgrade
    currentUpgrade.apply()
    for (let thing of sprites.allOfKind(SpriteKind.Upgrade)) {
        let upg = thing as Upgrade
        sprites.destroy(upg.pic)
        sprites.destroy(upg.text)
        sprites.destroy(thing)
    }
    startWave()
})

browserEvents.onMouseMove(function(x: number, y: number) {
    cursor.setPosition(x, y)
})

browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x: number, y: number) {
    let click = sprites.create(assets.image`click`, SpriteKind.Food)
    click.setPosition(x, y)
    click.setFlag(SpriteFlag.Invisible, true)
    click.lifespan = 50
})

browserEvents.MouseRight.onEvent(browserEvents.MouseButtonEvent.Pressed, function(x: number, y: number) {
    if (ranged == rangedAttacks.incineration) {
        let newLaser = new Incineration
    }
})

browserEvents.MouseRight.onEvent(browserEvents.MouseButtonEvent.Released, function (x: number, y: number) {
    if (ranged == rangedAttacks.incineration) {
        for (let sprite of sprites.allOfKind(SpriteKind.Projectile)) {
            sprites.destroy(sprite)
        }
    }
})